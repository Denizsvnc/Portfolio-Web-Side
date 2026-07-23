import Express from "express";
import dotenv from "dotenv";
import path from "path";
import { apiReference } from "@scalar/express-api-reference";
import { openApiSpec } from "./docs/openapi";
import authRoutes from "./modules/auth/auth.routes";
import aboutRoutes from "./modules/about/about.routes";
import skillsRoutes from "./modules/skilss/skilss.routes";
import imagesRoutes from "./modules/images/images.routes";
import projectsRoutes from "./modules/projects/projects.routes";
import blogsRoutes from "./modules/blogs/blogs.routes";
import analyticsRoutes from "./modules/analytics/analytics.routes";
import { trackVisitor } from "./common/middleware/visitor.middleware";

dotenv.config();
const app = Express();

app.use(Express.json());

// Statik dosya erişimi (uploads klasörü)
app.use("/uploads", Express.static(path.join(process.cwd(), "uploads")));

// Ziyaretçi ve İstatistik Takip Middleware
app.use(trackVisitor);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/images", imagesRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/blogs", blogsRoutes);
app.use("/api/analytics", analyticsRoutes);

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
