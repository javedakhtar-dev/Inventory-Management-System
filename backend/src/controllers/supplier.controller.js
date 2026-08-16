const Supplier = require("../models/Supplier");
const addSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);
    res
      .status(201)
      .json({
        success: true,
        message: "Supplier created.",
        data: { supplier },
      });
  } catch (error) {
    next(error);
  }
};
const suppliers = async (req, res, next) => {
  try {
    const search = req.query.search?.trim();
    const filter = search
      ? {
          $or: ["name", "companyName", "email", "phone"].map((field) => ({
            [field]: { $regex: search, $options: "i" },
          })),
        }
      : {};
    const suppliers = await Supplier.find(filter).sort({ name: 1 });
    res.json({ success: true, data: { suppliers } });
  } catch (error) {
    next(error);
  }
};
const supplierId = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier)
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found." });
    res.json({ success: true, data: { supplier } });
  } catch (error) {
    next(error);
  }
};
const updateSupplier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!supplier)
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found." });
    res.json({
      success: true,
      message: "Supplier updated.",
      data: { supplier },
    });
  } catch (error) {
    next(error);
  }
};
const deleteSuppier = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndDelete(req.params.id);
    if (!supplier)
      return res
        .status(404)
        .json({ success: false, message: "Supplier not found." });
    res.json({ success: true, message: "Supplier deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addSupplier,
  suppliers,
  supplierId,
  updateSupplier,
  deleteSuppier,
};
