import express from 'express'
// const userController = require('../../controllers/userController');

const squareRouter = express.Router();

import Square from 'square'
import { generateStateValue } from '../../utils/generateStateValue.js';
import Company from '../../models/Company.model.js';

// Configure Square API credentials
const squareConfig = {
    environment: 'sandbox', // Set to 'Production' for live environment
    accessToken: 'YOUR_SQUARE_ACCESS_TOKEN',
    basePath: 'https://connect.squareupsandbox.com', // Set to production URL for live data
    clientId: 'sandbox-sq0idb-mlpR8BholAZpFq_2EsgBaQ',
    clientSecret: 'sandbox-sq0csb-PH9modo0DxRuODe_ps4hDjucu2TIq5U4xJOfgchd464',
    callbackURL: 'http://localhost:3000/api/square/callback',
}

// Initialize Square OAuth client
const { Client } = Square
const squareClient = new Client(squareConfig)

// GET /api/users
squareRouter.get('/auth', async (req, res) => {
    const { realmId } = req.query
    console.log('REALM ID', realmId)
    const { clientId, callbackURL } = squareConfig;
    const scope = 'PAYMENTS_READ,PAYMENTS_WRITE'; // Replace with the actual scopes your application needs
  
    const state = generateStateValue() // Optional: Include a state value for CSRF protection or other purposes

    // TODO: Save state to db with realm id for use later on 
    const existingCompany = await Company.findOne({ 'quickbooks.realmId': realmId })

    console.log('EXISTING COMPANY', existingCompany)
    existingCompany.square = {
      state: state
    }
    existingCompany.save()

    const authUrl = `https://connect.squareupsandbox.com/oauth2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${callbackURL}&state=${state}`;

    console.log('OAUTH URL', authUrl)
    res.redirect(authUrl);
});

squareRouter.get('/callback', async (req, res) => {
    const { code, state } = req.query;

    console.log('CODE', code)
    console.log('STATE', state)
  
    try {
      // Verify the state value for CSRF protection if desired
  
      // Exchange the authorization code for an access token
      const response = await squareClient.oAuthApi.obtainToken({
        clientId: squareConfig.clientId,
        clientSecret: squareConfig.clientSecret,
        code: code,
        grantType: 'authorization_code',
        redirectUri: squareConfig.callbackURL
      });
  
      const result = response.result
      const accessToken = result.accessToken
  
      console.log('ACCESS TOKEN', accessToken)
      // Store the Square access token in your database or session for later use
      // TODO: Store in database

      const existingCompany = await Company.findOne({ 'square.state': state })

      // Update the existingCompany.square field without overwriting existing information
      existingCompany.square = { ...existingCompany.square, ...result };

      // Save the updated existingCompany
      await existingCompany.save();

      console.log('EXISTING COMPANY UPDATED', existingCompany)
  
      res.send('Square authentication successful! Token received.');
    } catch (error) {
      console.error('Square OAuth error:', error);
      res.send('Square OAuth error occurred.');
    }
});

export default squareRouter
