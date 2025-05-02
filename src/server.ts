import app from './app'
import { connectDB } from './config/database'
import { config } from './config/config'


// Connect to MongoDB
connectDB()

// Start the server
const server = app.listen(config.PORT, () => {
  console.log(
    `Server running in ${config.NODE_ENV} mode on port ${config.PORT}`
  )
})

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
