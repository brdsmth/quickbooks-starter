import express from 'express'
import jwt from 'jsonwebtoken'
import IntuitOAuth from 'intuit-oauth'
import Company from '../../models/Company.model.js';
import { addSalesReceiptToQuickbooks } from '../../controllers/quickbooks.js';

const quickbooksRouter = express.Router();

// Configure QuickBooks API credentials
export const quickbooksConfig = {
    clientId: 'ABrOpCONEPxj0EDOuUSkmXQBqtm56H84ayhwmLxzogDiAqALCu',
    clientSecret: 'UhSoiM915ljdqqXqKL7EhDKoBHnTCa9qS0z0S1RJ',
    redirectUri: 'http://localhost:3000/api/quickbooks/callback',
    sandbox: true, // Set to false for production
};


// Initialize QuickBooks OAuth client
const quickbooksOAuthClient = new IntuitOAuth(quickbooksConfig);

// Define endpoints for OAuth authorization
quickbooksRouter.get('/auth', (req, res) => {
    const authUri = quickbooksOAuthClient.authorizeUri({ 
        scope: [
            IntuitOAuth.scopes.Accounting, 
            // IntuitOAuth.scopes.Email, 
            // IntuitOAuth.scopes.Intuit_name, 
            // IntuitOAuth.scopes.Profile
        ], 
        state: 'testState' 
    });
    console.log(authUri)
    res.redirect(authUri);
});
  
quickbooksRouter.get('/callback', async (req, res) => {
    const { code } = req.query;

    console.log('QB CALLBACK CODE', code)
    try {
        const callbackResponse = await quickbooksOAuthClient.createToken(req.url);
        console.log('CALLBACK RESPONSE', callbackResponse)

        const token = callbackResponse.token
        console.log('TOKEN', token)

        const realmId = token.realmId
        const accessToken = token.access_token
        const refreshToken = token.refresh_token

        console.log('ACCESS TOKEN', accessToken)
        console.log('REFRESH TOKEN', refreshToken)

        // Store the QuickBooks access token and refresh token in your database or session for later use
        // TODO: Store in database
        // TODO: Check if company already exists, if so just update tokens
        const existingCompany = await Company.findOne({ 'quickbooks.realmId': realmId })
        console.log('EXISTING QUICKBOOKS COMPANY', existingCompany)

        if (!existingCompany) {
            const company = await Company.create({
                quickbooks: token
            })
    
            await company.save()
        } else {
            // Update the existingCompany.square field without overwriting existing information
            // TODO: Remove the null values from info so that we aren't overwriting the refreshToken
            existingCompany.quickbooks = { ...existingCompany.quickbooks, ...token };
            await existingCompany.save()
        }


        // Generate JWT
        const jsonToken = jwt.sign({ id: existingCompany.id }, 'your-secret-key');

        res.redirect(`/?realmId=${realmId}&token=${jsonToken}`)
    } catch (error) {
        console.error('QuickBooks OAuth error:', error);
        res.send('QuickBooks OAuth error occurred.');
    }
});


// GET /api/quickbooks/sync
quickbooksRouter.post('/sync', async (req, res) => {
    console.log('SYNC ROUTE')
  
    const { jwtToken } = req.body
    const decoded = jwt.verify(jwtToken, 'your-secret-key');  
    const company = await Company.findOne({ _id: decoded.id })
  
    try {
        company.square.payments.map(async (p) => {
            console.log('PAYMENT', p)

            await addSalesReceiptToQuickbooks({
                accessToken: company.quickbooks.access_token,
                realmId: company.quickbooks.realmId,
                payment: p
            })
        })
  
      res.sendStatus(200)
    } catch (e) {
      console.log('ERROR: ', e)
    }
});  

export default quickbooksRouter