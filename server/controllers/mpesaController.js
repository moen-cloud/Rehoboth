import axios from 'axios';
import Order from '../models/Order.js';

// Determine which M-Pesa environment to use
const MPESA_ENV = process.env.MPESA_ENV || 'sandbox'; // 'sandbox', 'production', or 'mock'
const MPESA_BASE_URL = MPESA_ENV === 'production' 
  ? 'https://api.safaricom.co.ke' 
  : 'https://sandbox.safaricom.co.ke';

const generateToken = async () => {
  // Skip token generation for mock
  if (MPESA_ENV === 'mock') {
    return 'mock_token_12345';
  }

  const auth = Buffer.from(
    `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
  ).toString('base64');

  try {
    const response = await axios.get(
      `${MPESA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Token generation error:', error.response?.data || error.message);
    throw error;
  }
};

// Mock payment handler
const mockStkPush = async (phone, amount, orderId) => {
  console.log('=== MOCK PAYMENT ===');
  console.log('Environment: MOCK (for development)');
  console.log('Phone:', phone);
  console.log('Amount:', amount);
  console.log('Order ID:', orderId);

  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Simulate 90% success rate
  const isSuccess = Math.random() > 0.1;

  if (isSuccess) {
    // Auto-update order as paid after 2 seconds (simulate user entering PIN)
    setTimeout(async () => {
      try {
        await Order.findByIdAndUpdate(orderId, {
          isPaid: true,
          paidAt: Date.now(),
          paymentResult: {
            transactionId: `MOCK${Date.now()}`,
            status: 'Success',
            updateTime: new Date().toISOString(),
          },
        });
        console.log('✓ Mock payment completed for order:', orderId);
      } catch (error) {
        console.error('Mock payment update error:', error);
      }
    }, 2000);

    return {
      MerchantRequestID: `mock-merchant-${Date.now()}`,
      CheckoutRequestID: `mock-checkout-${Date.now()}`,
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing (MOCK MODE)',
    };
  } else {
    return {
      ResponseCode: '1',
      ResponseDescription: 'Mock payment failed - simulated error',
      CustomerMessage: 'Mock payment failed',
    };
  }
};

export const stkPush = async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body;

    console.log('=== M-PESA STK PUSH ===');
    console.log('Environment:', MPESA_ENV);
    console.log('Base URL:', MPESA_BASE_URL);
    console.log('Phone:', phone);
    console.log('Amount:', amount);
    console.log('Order ID:', orderId);

    // Validate inputs
    if (!phone || !amount || !orderId) {
      return res.status(400).json({
        message: 'Missing required fields: phone, amount, or orderId',
      });
    }

    // Validate phone number format (must be 254XXXXXXXXX)
    const cleanPhone = phone.replace(/\s/g, '');
    if (!/^254\d{9}$/.test(cleanPhone)) {
      return res.status(400).json({
        message: 'Invalid phone number format. Must be 254XXXXXXXXX (e.g., 254712345678)',
        example: '254712345678',
      });
    }

    // Handle mock payment
    if (MPESA_ENV === 'mock') {
      const mockResponse = await mockStkPush(cleanPhone, amount, orderId);
      return res.json(mockResponse);
    }

    // Real M-Pesa payment (sandbox or production)
    const token = await generateToken();
    console.log('✓ Token generated');

    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, '')
      .slice(0, -3);
    
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const requestBody = {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: Math.round(amount),
      PartyA: cleanPhone,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: cleanPhone,
      CallBackURL: process.env.MPESA_CALLBACK_URL,
      AccountReference: `Order-${orderId}`,
      TransactionDesc: `Payment for Order ${orderId}`,
    };

    console.log('Sending request to M-Pesa...');

    const response = await axios.post(
      `${MPESA_BASE_URL}/mpesa/stkpush/v1/processrequest`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log('✓ M-Pesa Response:', response.data);

    // Check response code
    if (response.data.ResponseCode !== '0') {
      console.error('M-Pesa Error Response:', response.data);
      return res.status(400).json({
        message: response.data.ResponseDescription || 'M-Pesa request failed',
        errorCode: response.data.ResponseCode,
        customerMessage: response.data.CustomerMessage,
      });
    }

    res.json(response.data);
  } catch (error) {
    console.error('=== STK PUSH ERROR ===');
    console.error('Error:', error.response?.data || error.message);

    const errorData = error.response?.data;
    let userMessage = 'Payment initiation failed';
    
    // Handle specific error cases
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      userMessage = 'Cannot connect to M-Pesa. Please try again later.';
    } else if (error.code === 'ENOTFOUND') {
      userMessage = 'M-Pesa service unavailable. Check your internet connection.';
    } else if (errorData?.errorCode === '401' || errorData?.errorCode === '403') {
      userMessage = 'Invalid M-Pesa credentials. Please contact support.';
    } else if (errorData?.errorMessage) {
      userMessage = errorData.errorMessage;
    } else if (error.message) {
      userMessage = error.message;
    }

    res.status(500).json({ 
      message: userMessage,
      error: errorData || error.message,
      environment: MPESA_ENV,
      tip: MPESA_ENV === 'sandbox' 
        ? 'Sandbox is often unreliable. Consider using mock mode for development.' 
        : 'Please try again or contact support if the issue persists.',
    });
  }
};

export const mpesaCallback = async (req, res) => {
  try {
    console.log('=== M-PESA CALLBACK RECEIVED ===');
    console.log('Full callback data:', JSON.stringify(req.body, null, 2));
    
    const { Body } = req.body;
    
    if (!Body || !Body.stkCallback) {
      console.error('Invalid callback format');
      return res.status(400).json({ 
        ResultCode: 1, 
        ResultDesc: 'Invalid callback format' 
      });
    }

    const { stkCallback } = Body;
    const { ResultCode, ResultDesc, CheckoutRequestID, CallbackMetadata } = stkCallback;

    console.log('Result Code:', ResultCode);
    console.log('Result Description:', ResultDesc);
    console.log('Checkout Request ID:', CheckoutRequestID);

    if (ResultCode === 0) {
      // Payment successful
      console.log('✓ Payment successful');
      
      // Extract payment details from callback metadata
      let transactionId, amount, phoneNumber;
      
      if (CallbackMetadata && CallbackMetadata.Item) {
        CallbackMetadata.Item.forEach(item => {
          if (item.Name === 'MpesaReceiptNumber') transactionId = item.Value;
          if (item.Name === 'Amount') amount = item.Value;
          if (item.Name === 'PhoneNumber') phoneNumber = item.Value;
        });
      }

      console.log('Transaction ID:', transactionId);
      console.log('Amount:', amount);
      console.log('Phone:', phoneNumber);

      // TODO: Update order in database
      // You'll need to store CheckoutRequestID when initiating payment
      // Then use it here to find and update the order
      
    } else {
      // Payment failed
      console.log('✗ Payment failed');
      console.log('Reason:', ResultDesc);
    }

    // Always return success to M-Pesa
    res.json({ 
      ResultCode: 0, 
      ResultDesc: 'Callback received successfully' 
    });
    
  } catch (error) {
    console.error('=== CALLBACK PROCESSING ERROR ===');
    console.error('Error:', error);
    
    // Still return success to M-Pesa to avoid retries
    res.json({ 
      ResultCode: 0, 
      ResultDesc: 'Callback received' 
    });
  }
};

// Test endpoint
export const testMpesaConnection = async (req, res) => {
  try {
    console.log('=== M-PESA CONNECTION TEST ===');
    console.log('Environment:', MPESA_ENV);
    console.log('Base URL:', MPESA_BASE_URL);
    
    // Check environment variables
    const requiredEnvVars = [
      'MPESA_CONSUMER_KEY',
      'MPESA_CONSUMER_SECRET',
      'MPESA_SHORTCODE',
      'MPESA_PASSKEY',
      'MPESA_CALLBACK_URL'
    ];
    
    const missingVars = requiredEnvVars.filter(v => !process.env[v]);
    
    if (MPESA_ENV !== 'mock' && missingVars.length > 0) {
      return res.status(500).json({
        success: false,
        error: 'Missing environment variables',
        missing: missingVars,
        tip: 'Add these to your .env file',
      });
    }

    if (MPESA_ENV === 'mock') {
      return res.json({
        success: true,
        environment: 'mock',
        message: 'Mock payment mode - no real API calls',
        note: 'Payments will be auto-approved after 2 seconds',
      });
    }

    // Test token generation
    const token = await generateToken();
    console.log('✓ Token generated successfully');
    
    res.json({
      success: true,
      environment: MPESA_ENV,
      baseUrl: MPESA_BASE_URL,
      message: 'M-Pesa credentials are valid',
      tokenGenerated: true,
      shortcode: process.env.MPESA_SHORTCODE,
      callbackUrl: process.env.MPESA_CALLBACK_URL,
    });
    
  } catch (error) {
    console.error('Connection test failed:', error);
    
    res.status(500).json({
      success: false,
      environment: MPESA_ENV,
      error: error.response?.data || error.message,
      possibleReasons: [
        'Invalid credentials',
        'M-Pesa API is down',
        'Network connectivity issue',
        'Incorrect environment configuration',
      ],
    });
  }
};