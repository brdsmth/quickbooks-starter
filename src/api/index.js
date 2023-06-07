import express from 'express'
import squareRouter from './routes/squareRoutes.js';
import quickbooksRouter from './routes/quickbooksRoutes.js';
const apiRouter = express.Router();


apiRouter.use('/square', squareRouter)
apiRouter.use('/quickbooks', quickbooksRouter)

export default apiRouter