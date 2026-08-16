const Customer = require("../models/Customer");

const addCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({
      success: true,
      message: "Customer created.",
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

const customers = async (req, res, next) => {
  try {
    const search = req.query.search?.trim();
    const filter = search
      ? {
          $or: ["name", "email", "phone"].map((field) => ({
            [field]: { $regex: search, $options: "i" },
          })),
        }
      : {};
    const customers = await Customer.find(filter).sort({ name: 1 });
    res.json({ success: true, data: { customers } });
  } catch (error) {
    next(error);
  }
};

const customerId = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    res.json({ success: true, data: { customer } });
  } catch (error) {
    next(error);
  }
};

const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    res.json({
      success: true,
      message: "Customer updated.",
      data: { customer },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res
        .status(404)
        .json({ success: false, message: "Customer not found." });
    res.json({ success: true, message: "Customer deleted." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCustomer,
  customers,
  customerId,
  updateCustomer,
  deleteCustomer,
};
