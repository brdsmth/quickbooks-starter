import express from 'express'
import quickbooksRouter from './routes/quickbooksRoutes.js';

const apiRouter = express.Router();

apiRouter.use('/quickbooks', quickbooksRouter)

export default apiRouter