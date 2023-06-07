import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import Quickbooks from 'node-quickbooks'
import dotenv from 'dotenv'
import apiRouter from './src/api/index.js'
// const path = require('path');
// const mongoose = require('mongoose')
// const QuickBooks = require('quickbooks');
// require('dotenv').config()
dotenv.config()

const PORT = parseInt(process.env.PORT, 10) || 8081
const isDev = process.env.NODE_ENV === 'dev'
console.log('IS DEV', isDev)

// MongoDB Connection
const mongoUrl =
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/shopify-express-app'

console.log('MONGO URL', mongoUrl)
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
app.use('/api', apiRouter)

// // Define endpoint for importing sales
// app.get('/import-sales', async (req, res) => {
//   try {
//     // Retrieve sales data from Square API
//     const squarePayments = await getSquarePayments();

//     // Process and map Square payments to QuickBooks format
//     const quickbooksTransactions = mapToQuickBooksFormat(squarePayments);

//     // Import transactions to QuickBooks
//     await importTransactionsToQuickBooks(quickbooksTransactions);

//     // Respond with success message
//     res.status(200).json({ message: 'Sales transactions imported successfully' });
//   } catch (error) {
//     // Handle errors
//     console.error('Error importing sales transactions:', error);
//     res.status(500).json({ error: 'Failed to import sales transactions' });
//   }
// });

// For any other route, serve the React application
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'));
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
