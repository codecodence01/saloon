const Package = require('../models/Package');

// GET /api/packages
exports.getPackages = async (req, res, next) => {
  try {
    const { tier, isActive } = req.query;
    const filter = {};
    if (tier) filter.tier = tier;
    filter.isActive = isActive === 'false' ? false : true;

    const packages = await Package.find(filter).sort({ discountedPrice: 1 });
    res.status(200).json({ success: true, count: packages.length, data: packages });
  } catch (err) {
    next(err);
  }
};

// GET /api/packages/:id
exports.getPackage = async (req, res, next) => {
  try {
    const pkg = await Package.findById(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
    res.status(200).json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

// POST /api/packages (admin)
exports.createPackage = async (req, res, next) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

// PUT /api/packages/:id (admin)
exports.updatePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
    res.status(200).json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/packages/:id (admin)
exports.deletePackage = async (req, res, next) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found.' });
    res.status(200).json({ success: true, message: 'Package deleted.' });
  } catch (err) {
    next(err);
  }
};
