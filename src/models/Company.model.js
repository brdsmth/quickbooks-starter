import mongoose from 'mongoose'

// Define the User schema
const companySchema = new mongoose.Schema({
//   email: { type: String, required: true },
//   password: { type: String, required: true },
//   squareAccessToken: { type: String },
//   quickbooksAccessToken: { type: String },
//   quickbooksRefreshToken: { type: String },
  quickbooks: {
    type: Object
  },
  square: {
    type: Object
  },
  // squarePayments: {
  //   type: Array,
  //   default: [],
  // },
  // Other user fields as needed
});

// Create the User model
const Company = mongoose.model('Company', companySchema);

export default Company