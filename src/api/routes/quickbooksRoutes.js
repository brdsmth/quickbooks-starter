import express from 'express'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import IntuitOAuth from 'intuit-oauth'
import Company from '../../models/Company.model.js';

dotenv.config()

const quickbooksRouter = express.Router();

// Configure QuickBooks API credentials
export const quickbooksConfig = {
    clientId: process.env.QUICKBOOKS_CLIENT_ID,
    clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET,
    redirectUri: process.env.QUICKBOOKS_REDIRECT_URL,
    sandbox: true, // Set to false for production
};

// Initialize QuickBooks OAuth client
const quickbooksOAuthClient = new IntuitOAuth(quickbooksConfig);

// Define endpoints for OAuth authorization
quickbooksRouter.get('/auth', (req, res) => {
    const authUri = quickbooksOAuthClient.authorizeUri({ 
        scope: [
            IntuitOAuth.scopes.Accounting, 
        ], 
        state: 'testState' 
    });
    res.redirect(authUri);
});
  
quickbooksRouter.get('/callback', async (req, res) => {
    const { code } = req.query;

    try {
        const callbackResponse = await quickbooksOAuthClient.createToken(req.url);

        const token = callbackResponse.token

        const realmId = token.realmId

        /**
         * Access and refresh tokens can be pulled out separately if needed
         * const { access_token, refresh_token } = token.access_token
         */

        // Store the QuickBooks access token and refresh token in your database or session for later use
        const existingCompany = await Company.findOne({ 'quickbooks.realmId': realmId })

        if (!existingCompany) {
            const company = await Company.create({
                quickbooks: token
            })
    
            await company.save()
        } else {
            existingCompany.quickbooks = { ...existingCompany.quickbooks, ...token };
            await existingCompany.save()
        }

        // Generate JWT
        const jsonToken = jwt.sign({ id: existingCompany.id }, process.env.JWT_SECRET);

        res.redirect(`/?realmId=${realmId}&token=${jsonToken}`)
    } catch (error) {
        console.error('QuickBooks OAuth error:', error);
        res.send('QuickBooks OAuth error occurred.');
    }
});

export default quickbooksRouter