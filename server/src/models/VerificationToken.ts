import mongoose, { Schema, Document } from "mongoose"

export interface VerificationTokenDocument extends Document {
  userId: string
  token: string
  expiresAt: Date
}

const VerificationTokenSchema = new Schema<VerificationTokenDocument>({
  userId: { 
    type: String, 
    required: true 
},
  token: { 
    type: String, 
    required: true 
},
  expiresAt: { type: Date, required: true },
})

export default mongoose.model<VerificationTokenDocument>(
  "VerificationToken",
  VerificationTokenSchema
)
