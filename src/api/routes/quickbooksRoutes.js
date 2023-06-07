import express from 'express'
import User from '../../models/Company.model.js';
import { getUserInfoFromQuickbooks } from '../../controllers/quickbooks.js';
const quickbooksRouter = express.Router();

import QuickBooks from 'node-quickbooks';
import IntuitOAuth from 'intuit-oauth'
import Company from '../../models/Company.model.js';
// const IntuitOAuth = require('intuit-oauth');
// const userController = require('../../controllers/userController');



// Configure QuickBooks API credentials
export const quickbooksConfig = {
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
    // console.log('REQ', req)
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

        const info = await getUserInfoFromQuickbooks({
            accessToken: accessToken,
            realmId: realmId
        })

        // TODO: Check if company already exists, if so just update tokens
        const existingCompany = await Company.findOne({ 'quickbooks.realmId': realmId })
        console.log('EXISTING QUICKBOOKS COMPANY', existingCompany)

        if (!existingCompany) {
            const company = await Company.create({
                quickbooks: info
            })
    
            await company.save()
        } else {
            // Update the existingCompany.square field without overwriting existing information
            // TODO: Remove the null values from info so that we aren't overwriting the refreshToken
            existingCompany.quickbooks = { ...existingCompany.quickbooks, ...info };
            await existingCompany.save()
        }


        // res.send('QuickBooks authentication successful! Tokens received.');
        // alert('QuickBooks authentication successful! Tokens received.')
        res.redirect(`/?realmId=${realmId}`)
    } catch (error) {
        console.error('QuickBooks OAuth error:', error);
        res.send('QuickBooks OAuth error occurred.');
    }
});


export default quickbooksRouter