import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { requestLogger } from './middleware/requestLogger';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app: Application = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: function (origin, callback) {
    // Allow any origin in local development to avoid Vite port conflicts
    callback(null, true);
  },
  credentials: true,
}));

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(requestLogger);

// API Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404);
  next(new Error(`Not Found - ${req.originalUrl}`));
});

// Centralized Error Handling
app.use(errorHandler);

export default app;
