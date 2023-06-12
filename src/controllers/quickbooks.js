import Quickbooks from 'node-quickbooks';
import { quickbooksConfig } from '../api/routes/quickbooksRoutes.js';
import { convertBigIntToDecimal } from '../utils/convertBigIntToDecimal128.js';
import { convertToMoneyForQuickbooks } from '../utils/convertToMoneyForQuickbooks.js';

const SQUARE_BOOKS_CUSTOMER_ID = '58'

// Function to get user info from QuickBooks
export const getUserInfoFromQuickbooks = async ({ accessToken, realmId }) => {
  
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

    return quickbooks
}

// Function to import transactions to QuickBooks
export const addPaymentToQuickbooks = async ({ accessToken, realmId, payment }) => {
  console.log('ADDING PAYMENTS TO QUICKBOOKS')

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

  quickbooks.createPayment({
    "TotalAmt": convertBigIntToDecimal(payment.amountMoney.amount.path),
    "CustomerRef": {
      "value": SQUARE_BOOKS_CUSTOMER_ID
    },
    "CurrencyRef": {
      "value": "USD"
    },
    "PrivateNote": payment.id
  }, (e) => {
    if (e && e.Fault && e.Fault.Error) {
      console.log('ERROR', e.Fault.Error)
    }
  })

  return quickbooks
}


// Function to add sales receipts to QuickBooks
export const addSalesReceiptToQuickbooks = async ({ accessToken, realmId, payment }) => {
  console.log('ADDING SALES RECEIPTS TO QUICKBOOKS')

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

  quickbooks.createSalesReceipt({
    "Line": [
      {
        "Description": "SQUARE BOOKS", 
        "DetailType": "SalesItemLineDetail", 
        "SalesItemLineDetail": {
          "TaxCodeRef": {
            "value": "NON"
          }, 
          "Qty": 1, 
          "UnitPrice": convertToMoneyForQuickbooks(convertBigIntToDecimal(payment.amountMoney.amount.path)),
          "ItemRef": {
            "name": "SQUARE BOOKS", 
            "value": "10"
          }
        }, 
        "LineNum": 1, 
        "Amount": convertToMoneyForQuickbooks(convertBigIntToDecimal(payment.amountMoney.amount.path)), 
        "Id": "1"
      },
    ],
    "CustomerRef": {
      "value": SQUARE_BOOKS_CUSTOMER_ID
    },
    "PrivateNote": payment.receiptUrl
  }, (e) => {
    if (e && e.Fault && e.Fault.Error) {
      console.log('ERROR', e.Fault.Error)
    }
  })


  // TODO: After it's been added to quickbooks we should update our database 
  // to log that its been recorded and use that for the UI and everything

  return quickbooks
}