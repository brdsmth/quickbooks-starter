import express from 'express'
import squareRouter from './routes/squareRoutes.js';
import quickbooksRouter from './routes/quickbooksRoutes.js';
import companyRouter from './routes/companyRoutes.js';

const apiRouter = express.Router();

apiRouter.use('/square', squareRouter)
apiRouter.use('/quickbooks', quickbooksRouter)
apiRouter.use('/company', companyRouter)

export default apiRouter