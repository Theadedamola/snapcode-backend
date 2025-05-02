import express, { Application, Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import passport from 'passport'
import dotenv from 'dotenv'
import swaggerJsDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import projectRoutes from './routes/project.routes'

// Load environment variables
dotenv.config()

// Import routes (will create these files later)
import authRoutes from './routes/auth.routes'
import snippetRoutes from './routes/snippet.routes'
import exportRoutes from './routes/export.routes'

// Import error types
import { NotFoundError, UnauthorizedError } from './utils/errors'

const app: Application = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // 100 requests per windowMs
  standardHeaders: 'draft-7',
  legacyHeaders: false,
})
app.use(limiter)

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Initialize passport
app.use(passport.initialize())

// Import passport configuration
import './config/passport'

// Swagger documentation setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SnapCode API',
      version: '1.0.0',
      description: 'API for code snippet design tool',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 4000}`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Path to the API docs
}

const swaggerDocs = swaggerJsDoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/snippets', snippetRoutes)
app.use('/api/export', exportRoutes)
app.use('/api/projects', projectRoutes)

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' })
})

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Route not found'))
})

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err)

  if (err instanceof NotFoundError) {
    return res.status(404).json({ error: err.message })
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({ error: err.message })
  }

  // Default to 500 server error
  return res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  })
})

export default app
