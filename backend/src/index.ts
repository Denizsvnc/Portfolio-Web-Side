import Express from "express";
import dotenv from "dotenv";
import { apiReference } from "@scalar/express-api-reference";
import { openApiSpec } from "./docs/openapi";
import authRoutes from "./modules/auth/auth.routes";
import aboutRoutes from "./modules/about/about.routes";

dotenv.config();
const app = Express();

app.use(Express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);

// Scalar API Documentation
app.get("/docs", apiReference({
  spec: {
    content: openApiSpec,
  },
  theme: "purple",
}));

app.get("/", (req, res) => {
  res.send("Hello World! API Documentation is available at /docs");
});

const BACKEND_PORT = process.env.BACKEND_PORT || 3005;
const BACKEND_HOST = process.env.BACKEND_HOST || "localhost";

app.listen(BACKEND_PORT, () => {
  console.log(`Server is running on port ${BACKEND_PORT}`);
  console.log(`Server is running on url http://${BACKEND_HOST}:${BACKEND_PORT}`);
  console.log(`API Documentation is available at http://${BACKEND_HOST}:${BACKEND_PORT}/docs`);
});
