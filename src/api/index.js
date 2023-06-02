const express = require('express');
const apiRouter = express.Router();
const quickbooksRouter = require("./routes/quickbooksRoutes");
const squareRouter = require("./routes/squareRoutes");


apiRouter.use('/square', squareRouter)
apiRouter.use('/quickbooks', quickbooksRouter)

module.exports = {
    apiRouter
}