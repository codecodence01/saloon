const Service = require('../models/Service');

// GET /api/services
exports.getServices = async (req, res, next) => {
  try {
    const { category, isPopular, isNew, isActive } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (isPopular !== undefined) filter.isPopular = isPopular === 'true';
    if (isNew !== undefined) filter.isNew = isNew === 'true';
    filter.isActive = isActive === 'false' ? false : true;

    const services = await Service.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
};

// GET /api/services/:id
exports.getService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// POST /api/services (admin)
exports.createService = async (req, res, next) => {
  try {
    const image = req.file ? (req.file.path || req.file.secure_url || '') : (req.body.image || '');
    const service = await Service.create({ ...req.body, image });
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// PUT /api/services/:id (admin)
exports.updateService = async (req, res, next) => {
  try {
    const updates = { ...req.body };
    if (req.file) updates.image = req.file.path || req.file.secure_url || '';

    const service = await Service.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/services/:id (admin)
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.status(200).json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    next(err);
  }
};
