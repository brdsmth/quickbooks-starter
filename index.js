import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import apiRouter from './src/api/index.js'

dotenv.config()

const PORT = parseInt(process.env.PORT, 10) || 8081
const isDev = process.env.NODE_ENV === 'dev'

// MongoDB Connection
const mongoUrl =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/shopify-express-app'

mongoose.connect(mongoUrl, (err) => {
  if (err) {
    console.error(
      '---> An error occured while connecting to MongoDB',
      err.message
    )
  } else {
    console.log('--> Connected to MongoDB')
    mongoose.set('strictQuery', false)
  }
})


// Initialize Express app
const app = express();

// Serve the React application build files
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname, 'client/build')));

// API Routes
app.use(express.json())
app.use('/api', apiRouter)

// React application routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
