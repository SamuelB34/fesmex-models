import mongoose, {
	Schema,
	model,
	type Model,
	type HydratedDocument,
	type Types,
} from "mongoose";

export interface RefreshTokenType {
	customer_id: Types.ObjectId;
	token_hash: string;
	expires_at: Date;
	revoked_at?: Date;
	replaced_by_token_hash?: string;
	created_at: Date;
	updated_at?: Date;
}

export type RefreshTokenDoc = HydratedDocument<RefreshTokenType>;
export type RefreshTokenModel = Model<RefreshTokenType>;

const refreshTokenSchema = new Schema<RefreshTokenType>({
	customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
	// Store only SHA-256 hash of the opaque refresh token (base64url). Never store the raw token.
	token_hash: { type: String, required: true },
	expires_at: { type: Date, required: true },
	revoked_at: { type: Date },
	replaced_by_token_hash: { type: String },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
});

refreshTokenSchema.index({ token_hash: 1 }, { unique: true });
refreshTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });
refreshTokenSchema.index({ customer_id: 1, expires_at: 1 });

refreshTokenSchema.pre("save", function (next) {
	this.updated_at = new Date();
});

const RefreshToken: RefreshTokenModel =
	(mongoose.models.RefreshToken as RefreshTokenModel) ||
	model<RefreshTokenType>("RefreshToken", refreshTokenSchema, "refresh_tokens");

export default RefreshToken;
