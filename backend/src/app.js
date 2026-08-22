const express = require("express");
const cors = require("cors");
const app = express();

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const supplierRoutes = require("./routes/supplier.routes");
const customerRoutes = require("./routes/customer.routes");
const purchaseRoutes = require("./routes/purchase.routes");
const saleRoutes = require("./routes/sale.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const categoryRoutes = require("./routes/category.routes");
const stockRoutes = require("./routes/stock.routes");
const errorMiddleware = require("./middleware/error.middleware");

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (Postman/curl) and the configured Vite app.
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error(`Origin ${origin} is not allowed by CORS.`));
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Inventory API is running",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/supplier", supplierRoutes);
app.use("/api/v1/customer", customerRoutes);
app.use("/api/v1/purchase", purchaseRoutes);
app.use("/api/v1/sale", saleRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/stock", stockRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorMiddleware);

module.exports = app;
