import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
  orderId: String,
  paymentId: String,
  signature: String,
  amount: Number,
  status: {
    type: String,
    default: "Success"
  }
}, { timestamps: true })

export default mongoose.models.Payment || mongoose.model('Payment', paymentSchema)