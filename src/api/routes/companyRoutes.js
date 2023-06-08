import express from 'express'
import jwt from 'jsonwebtoken'
import Company from '../../models/Company.model.js';
import { getSquarePayments } from '../../controllers/square.js';
import { convertBigIntToDecimal } from '../../utils/convertBigIntToDecimal128.js';

const companyRouter = express.Router();

// GET /api/company
companyRouter.post('/transactions', async (req, res) => {
    console.log('COMPANY TRANSACTIONS ROUTE')

  console.log('BODY', req.body)
  const { jwtToken } = req.body

  const decoded = jwt.verify(jwtToken, 'your-secret-key');
  console.log('DECODED', decoded)

  const company = await Company.findOne({ _id: decoded.id })
  console.log('COMPANY', company)

  try {
    await getSquarePayments({
      company: company
    })

    const updatedCompany = await Company.findOne({ _id: decoded.id })

    res.json({ transactions: updatedCompany.square.payments })
  } catch (e) {
    console.log('ERROR: ', e)
  }
});


export default companyRouter
