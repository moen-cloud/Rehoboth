import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('user', 'name email phone');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        transactionId: req.body.transactionId,
        status: req.body.status,
        updateTime: req.body.updateTime,
      };

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Update order to paid error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get all non-deleted orders for the user
    const orders = await Order.find({ 
      user: req.user._id,
      isDeleted: false 
    }).sort({ createdAt: -1 });
    
    // Filter orders based on cancellation and time rules
    const filteredOrders = orders.filter(order => {
      // Hide admin-cancelled orders immediately
      if (order.cancelledBy === 'admin') {
        return false;
      }
      
      // Hide customer-cancelled orders older than 7 days
      if (order.cancelledBy === 'customer' && order.cancelledAt) {
        return order.cancelledAt > sevenDaysAgo;
      }
      
      // Show all other orders
      return true;
    });
    
    res.json(filteredOrders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const now = new Date();
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get all non-deleted orders
    let orders = await Order.find({ isDeleted: false })
      .populate('user', 'id name email phone')
      .sort({ createdAt: -1 });
    
    // Filter out admin-cancelled orders older than 1 month
    orders = orders.filter(order => {
      if (order.cancelledBy === 'admin' && order.cancelledAt) {
        return order.cancelledAt > oneMonthAgo;
      }
      return true;
    });
    
    res.json(orders);
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    console.log('=== UPDATE ORDER STATUS DEBUG ===');
    console.log('Order ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('User:', req.user ? req.user._id : 'No user');
    console.log('Is Admin:', req.user ? req.user.isAdmin : false);

    const { status, adminResponse } = req.body;
    
    // Find the order
    const order = await Order.findOne({
      _id: req.params.id,
      isDeleted: false
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is cancelling their own order
    const isCustomerCancelling = !req.user.isAdmin && 
                                 status === 'Cancelled' &&
                                 order.user.toString() === req.user._id.toString();

    // Build update data
    const updateData = {};
    
    if (status) {
      updateData.status = status;
      
      // Handle cancellation
      if (status === 'Cancelled') {
        updateData.cancelledAt = Date.now();
        
        if (isCustomerCancelling) {
          updateData.cancelledBy = 'customer';
          updateData.adminResponse = adminResponse || 'Order cancelled by customer';
        } else if (req.user.isAdmin) {
          updateData.cancelledBy = 'admin';
          updateData.adminResponse = adminResponse || 'Order cancelled by admin';
        }
      }
      
      // Update delivery status if status is Delivered
      if (status === 'Delivered') {
        updateData.isDelivered = true;
        updateData.deliveredAt = Date.now();
      }
    }
    
    // Allow admins to update adminResponse without changing status
    if (adminResponse !== undefined && !status) {
      updateData.adminResponse = adminResponse;
    }

    console.log('Update data:', updateData);

    // Update the order
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { 
        new: true,
        runValidators: false
      }
    );

    console.log('Order updated successfully:', updatedOrder._id);
    res.json(updatedOrder);
  } catch (error) {
    console.error('=== UPDATE ORDER STATUS ERROR ===');
    console.error('Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Cleanup job - can be run periodically
export const cleanupOldOrders = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Soft delete customer-cancelled orders older than 7 days
    await Order.updateMany(
      {
        cancelledBy: 'customer',
        cancelledAt: { $lt: sevenDaysAgo },
        isDeleted: false
      },
      {
        isDeleted: true,
        deletedAt: now
      }
    );

    // Soft delete admin-cancelled orders older than 1 month
    await Order.updateMany(
      {
        cancelledBy: 'admin',
        cancelledAt: { $lt: oneMonthAgo },
        isDeleted: false
      },
      {
        isDeleted: true,
        deletedAt: now
      }
    );

    res.json({ message: 'Cleanup completed successfully' });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ message: error.message });
  }
};