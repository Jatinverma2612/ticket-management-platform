const User = require('../models/User');

// @desc    Get all engineers for assignment
// @route   GET /api/users/engineers
// @access  Private/Admin
const getEngineers = async (req, res, next) => {
  try {
    const engineers = await User.find({ role: 'engineer' })
      .select('_id name email role isAvailable createdAt')
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      message: 'Engineers retrieved successfully',
      data: engineers,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEngineers,
};
