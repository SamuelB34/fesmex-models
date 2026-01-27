import mongoose, {
	Schema,
	model,
	type Model,
	type HydratedDocument,
	type Types,
} from "mongoose";

export interface PasswordResetTokenType {
	customer_id: Types.ObjectId;
	token_hash: string;
	expires_at: Date;
	used_at?: Date;
	created_at: Date;
	updated_at?: Date;
}

export type PasswordResetTokenDoc = HydratedDocument<PasswordResetTokenType>;
export type PasswordResetTokenModel = Model<PasswordResetTokenType>;

const passwordResetTokenSchema = new Schema<PasswordResetTokenType>({
	customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
	// Store only SHA-256 hash of the opaque reset token (base64url). Never store the raw token.
	token_hash: { type: String, required: true },
	expires_at: { type: Date, required: true },
	used_at: { type: Date },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
});

passwordResetTokenSchema.index({ token_hash: 1 }, { unique: true });
passwordResetTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
passwordResetTokenSchema.index({ customer_id: 1, expires_at: 1 });

passwordResetTokenSchema.pre("save", function (next) {
	this.updated_at = new Date();
	next();
});

const PasswordResetToken: PasswordResetTokenModel =
	(mongoose.models.PasswordResetToken as PasswordResetTokenModel) ||
	model<PasswordResetTokenType>("PasswordResetToken", passwordResetTokenSchema, "password_reset_tokens");

export default PasswordResetToken;
