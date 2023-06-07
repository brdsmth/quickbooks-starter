import Quickbooks from 'node-quickbooks';
import { quickbooksConfig } from '../api/routes/quickbooksRoutes.js';

// Function to import transactions to QuickBooks
export const getUserInfoFromQuickbooks = async ({ accessToken, realmId }) => {
    // Retrieve QuickBooks access token and realm ID from your database or session
    // const accessToken = 'USER_QUICKBOOKS_ACCESS_TOKEN';
    // const realmId = 'USER_QUICKBOOKS_REALM_ID';
  
    const quickbooks = new Quickbooks({
      consumerKey: quickbooksConfig.clientId,
      consumerSecret: quickbooksConfig.clientSecret,
      token: accessToken,
      tokenSecret: '', // Not needed for OAuth2
      refreshToken: '', // Not needed for OAuth2
      realmId: realmId,
      oauthversion: '2.0', // Use OAuth2
      refreshTokenPolicy: 'disabled', // Disable automatic token refreshing
      minorversion: 62, // Set the desired QuickBooks API version
      useSandbox: true, // Set to false for production
    });

    // console.log('QUICKBOOKS', quickbooks)

    return quickbooks
  
    // Implement the logic to import transactions to QuickBooks using the QuickBooks API library
  }
  