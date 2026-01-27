import mongoose, {
  Schema,
  model,
  type Model,
  type HydratedDocument,
  type Types,
} from "mongoose"

export interface EmailVerificationTokenType {
  customer_id: Types.ObjectId
  token_hash: string
  expires_at: Date
  used_at?: Date
  created_at: Date
  updated_at?: Date
}

export type EmailVerificationTokenDoc =
  HydratedDocument<EmailVerificationTokenType>
export type EmailVerificationTokenModel = Model<EmailVerificationTokenType>

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenType>({
  customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  // Store only SHA-256 hash of the opaque email verification token. Never store the raw token.
  token_hash: { type: String, required: true },
  expires_at: { type: Date, required: true },
  used_at: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
})

emailVerificationTokenSchema.index({ token_hash: 1 }, { unique: true })
emailVerificationTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 })
emailVerificationTokenSchema.index({ customer_id: 1, expires_at: 1 })

const EmailVerificationToken: EmailVerificationTokenModel =
  (mongoose.models.EmailVerificationToken as EmailVerificationTokenModel) ||
  model<EmailVerificationTokenType>(
    "EmailVerificationToken",
    emailVerificationTokenSchema,
    "email_verification_tokens"
  )

export default EmailVerificationToken
