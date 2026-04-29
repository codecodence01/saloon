const Stylist = require('../models/Stylist');

// GET /api/stylists
exports.getStylists = async (req, res, next) => {
  try {
    const { isActive } = req.query;
    const filter = {};
    filter.isActive = isActive === 'false' ? false : true;

    const stylists = await Stylist.find(filter).sort({ experience: -1 });
    res.status(200).json({ success: true, count: stylists.length, data: stylists });
  } catch (err) {
    next(err);
  }
};

// GET /api/stylists/:id
exports.getStylist = async (req, res, next) => {
  try {
    const stylist = await Stylist.findById(req.params.id);
    if (!stylist) return res.status(404).json({ success: false, message: 'Stylist not found.' });
    res.status(200).json({ success: true, data: stylist });
  } catch (err) {
    next(err);
  }
};

// POST /api/stylists (admin)
exports.createStylist = async (req, res, next) => {
  try {
    const image = req.file ? (req.file.path || req.file.secure_url || '') : (req.body.image || '');
    const stylist = await Stylist.create({ ...req.body, image });
    res.status(201).json({ success: true, data: stylist });
  } catch (err) {
    next(err);
  }
};

// PUT /api/stylists/:id (admin)
exports.updateStylist = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path || req.file.secure_url || '';

    const stylist = await Stylist.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!stylist) return res.status(404).json({ success: false, message: 'Stylist not found.' });
    res.status(200).json({ success: true, data: stylist });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/stylists/:id (admin)
exports.deleteStylist = async (req, res, next) => {
  try {
    const stylist = await Stylist.findByIdAndDelete(req.params.id);
    if (!stylist) return res.status(404).json({ success: false, message: 'Stylist not found.' });
    res.status(200).json({ success: true, message: 'Stylist deleted.' });
  } catch (err) {
    next(err);
  }
};
