import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";

import routes from "./routes/index.routes";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { swaggerSpec } from "./docs/swagger";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

// Routes
app.use("/api", routes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// Middlewares
app.use(globalErrorHandler);

export default app;
