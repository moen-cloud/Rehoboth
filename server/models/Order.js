import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      price: { type: Number, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product',
      },
    },
  ],
  shippingAddress: {
    name: { type: String, required: false },
    phone: { type: String, required: false },
    mpesaPhone: { type: String, required: false },
    address: { type: String, required: false },
  },
  paymentMethod: {
    type: String,
    required: true,
    default: 'M-Pesa',
  },
  paymentResult: {
    transactionId: { type: String },
    status: { type: String },
    updateTime: { type: String },
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false,
  },
  paidAt: {
    type: Date,
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false,
  },
  deliveredAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  adminResponse: {
    type: String,
  },
  // Soft delete fields
  cancelledBy: {
    type: String,
    enum: ['customer', 'admin', null],
    default: null,
  },
  cancelledAt: {
    type: Date,
  },
  // For cleanup/archiving
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
orderSchema.index({ user: 1, isDeleted: 1, cancelledAt: 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;