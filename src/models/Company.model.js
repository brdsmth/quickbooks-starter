import mongoose from 'mongoose'

// Define the User schema
const companySchema = new mongoose.Schema({
  quickbooks: {
    type: Object
  },
});

// Create the User model
const Company = mongoose.model('Company', companySchema);

export default Company