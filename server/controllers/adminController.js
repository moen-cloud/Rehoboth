import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments({ isDeleted: false });
    const totalUsers = await User.countDocuments({ isAdmin: false });

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true, isDeleted: false } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const pendingOrders = await Order.countDocuments({
      status: 'Pending',
      isDeleted: false,
    });

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      pendingOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (admin)
// @route   GET /api/admin/products
// @access  Private/Admin
export const getAdminProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ sortOrder: 1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/admin/products
// @access  Private/Admin
export const createAdminProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock, sortOrder } = req.body;

    const product = new Product({
      name,
      description,
      price,
      image,
      category,
      stock,
      sortOrder: sortOrder || 0,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
export const updateAdminProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock, sortOrder } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.image = image ?? product.image;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;
    product.sortOrder = sortOrder ?? product.sortOrder;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product (and its Cloudinary image)
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
export const deleteAdminProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete image from Cloudinary
    if (product.image) {
      try {
        // Extract public_id from the Cloudinary URL
        const urlParts = product.image.split('/');
        const uploadIndex = urlParts.indexOf('upload');
        if (uploadIndex !== -1) {
          // Skip version segment if present (v1234567890)
          let publicIdParts = urlParts.slice(uploadIndex + 1);
          if (publicIdParts[0] && publicIdParts[0].match(/^v\d+$/)) {
            publicIdParts = publicIdParts.slice(1);
          }
          const publicIdWithExt = publicIdParts.join('/');
          const publicId = publicIdWithExt.replace(/\.[^/.]+$/, '');
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError);
        // Continue even if Cloudinary delete fails
      }
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
export const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({ isDeleted: false })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status (admin)
// @route   PUT /api/admin/orders/:id/status
// @access  Private/Admin
export const updateAdminOrderStatus = async (req, res) => {
  try {
    const { status, adminResponse } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status ?? order.status;
    if (adminResponse !== undefined) {
      order.adminResponse = adminResponse;
    }
    if (status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (admin)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};