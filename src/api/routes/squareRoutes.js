const express = require('express');
const squareRouter = express.Router();
const Square = require('square');
const { generateStateValue } = require('../../utils/generateStateValue');
// const userController = require('../../controllers/userController');


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
squareRouter.get('/auth', (req, res) => {
    const { clientId, callbackURL } = squareConfig;
    const scope = 'PAYMENTS_READ,PAYMENTS_WRITE'; // Replace with the actual scopes your application needs
  
    const state = generateStateValue() // Optional: Include a state value for CSRF protection or other purposes
    const authUrl = `https://connect.squareupsandbox.com/oauth2/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${callbackURL}&state=${state}`;

    console.log('OAUTH URL', authUrl)
    res.redirect(authUrl);
});

squareRouter.get('/callback', async (req, res) => {
    const { code, state } = req.query;
  
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
  
      res.send('Square authentication successful! Token received.');
    } catch (error) {
      console.error('Square OAuth error:', error);
      res.send('Square OAuth error occurred.');
    }
});

module.exports = squareRouter;

