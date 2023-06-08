import mongoose from 'mongoose'

const Decimal128 = mongoose.Decimal128

export const convertBigIntToDecimal = (obj) => {
    if (typeof obj === 'bigint') {
        return new Decimal128(obj.toString());
      }
      if (Array.isArray(obj)) {
        return obj.map(convertBigIntToDecimal);
      }
      if (typeof obj === 'object' && obj !== null) {
        const newObj = {};
        for (const key in obj) {
          newObj[key] = convertBigIntToDecimal(obj[key]);
        }
        return newObj;
      }
    return obj;
}

// // Usage example
// const payments = [
//   // Your payment objects here
// ];

// const convertedPayments = convertBigIntToDecimal(payments);
// console.log(convertedPayments);
