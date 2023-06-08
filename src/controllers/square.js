import Square from 'square'
import Company from '../models/Company.model.js';
import { convertBigIntToDecimal } from '../utils/convertBigIntToDecimal128.js';

// Function to retrieve payments from Square API
export const getSquarePayments = async ({ company }) => {

    const squareAccessToken = company.square.accessToken

    const squareClient = new Square.Client({
        environment: 'sandbox', // Set to 'Production' for live data
        accessToken: squareAccessToken, // Replace with your Square access token
    });
  
    // Create a request to list all payments
    const requestParams = {
    //   locationId: 'YOUR_SQUARE_LOCATION_ID', // Specify the Square location ID
    };

    const response = await squareClient.paymentsApi.listPayments()
    const payments = response.result.payments

    // Find the company document by ID
    const existingCompany = await Company.findOne({ _id: company._id })

    // Update the existingCompany.square field without overwriting existing information
    existingCompany.square = { ...existingCompany.square, payments: convertBigIntToDecimal(payments) };

    existingCompany.save()

    console.log('UPDATED COMPANY', existingCompany)

    return payments
}