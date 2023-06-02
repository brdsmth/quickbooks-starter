import SquareConnect from 'square-connect'

const squareClient = SquareConnect.ApiClient.instance;
squareClient.authentications['oauth2'].accessToken = 'EAAAEFmyCxM0RT5gL68JpV_rGLtdFkbTtjHESs8mn_S56KLCvdnrbT1vYaL5-Xtt';
squareClient.basePath = 'https://connect.squareupsandbox.com'; // Set to production URL for live data

console.log('SQUARE CLIENT', squareClient)


// Function to retrieve payments from Square API
async function getSquarePayments() {
    const paymentsApi = new SquareConnect.PaymentsApi(squareClient);
  
    // Create a request to list all payments
    const requestParams = {
    //   locationId: 'YOUR_SQUARE_LOCATION_ID', // Specify the Square location ID
    };
  
    const response = await paymentsApi.listPayments();
    console.log('RESPONSE', response.payments)
    return response.payments
}
  
getSquarePayments()