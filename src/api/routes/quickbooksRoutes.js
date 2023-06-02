const express = require('express');
const quickbooksRouter = express.Router();
const QuickBooks = require('quickbooks');
const IntuitOAuth = require('intuit-oauth');
// const userController = require('../../controllers/userController');



// Configure QuickBooks API credentials
const quickbooksConfig = {
    clientId: 'ABrOpCONEPxj0EDOuUSkmXQBqtm56H84ayhwmLxzogDiAqALCu',
    clientSecret: 'UhSoiM915ljdqqXqKL7EhDKoBHnTCa9qS0z0S1RJ',
    redirectUri: 'http://localhost:3000/api/quickbooks/callback',
    sandbox: true, // Set to false for production
};


// Initialize QuickBooks OAuth client
const quickbooksOAuthClient = new IntuitOAuth(quickbooksConfig);
console.log(quickbooksOAuthClient)


// Define endpoints for OAuth authorization
quickbooksRouter.get('/auth', (req, res) => {
    const authUri = quickbooksOAuthClient.authorizeUri({ scope: [IntuitOAuth.scopes.Accounting], state: 'testState' });
    console.log(authUri)
    res.redirect(authUri);
});
  
quickbooksRouter.get('/callback', async (req, res) => {
    // console.log('REQ', req)
    const { code } = req.query;

    console.log('QB CALLBACK CODE', code)
    try {
        const callbackResponse = await quickbooksOAuthClient.createToken(req.url);
        const token = callbackResponse.token
        console.log('TOKEN', token)
        const accessToken = token.access_token
        const refreshToken = token.refresh_token

        console.log('ACCESS TOKEN', accessToken)
        console.log('REFRESH TOKEN', refreshToken)

        // Store the QuickBooks access token and refresh token in your database or session for later use
        // TODO: Store in database


        res.send('QuickBooks authentication successful! Tokens received.');
    } catch (error) {
        console.error('QuickBooks OAuth error:', error);
        res.send('QuickBooks OAuth error occurred.');
    }
});


module.exports = quickbooksRouter;