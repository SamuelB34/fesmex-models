import mongoose, { Schema, model, Types } from "mongoose"

export enum PaymentProvider {
	STRIPE = "stripe",
}

export enum PaymentMethodType {
	CARD = "card",
	APPLE_PAY = "apple_pay",
	GOOGLE_PAY = "google_pay",
	BANK_TRANSFER = "bank_transfer",
}

export type PaymentMethodWallet = "apple_pay" | "google_pay"

export interface CustomerPaymentMethodDocument {
	customer_id: Types.ObjectId
	provider: PaymentProvider
	provider_customer_id: string
	provider_payment_method_id: string
	type: PaymentMethodType
	brand: string
	last4: string
	exp_month: number
	exp_year: number
	wallet?: PaymentMethodWallet | null
	is_default: boolean
	created_at: Date
	updated_at?: Date
	deleted_at?: Date
	deleted_by?: Types.ObjectId
}

const paymentMethodSchema = new Schema<CustomerPaymentMethodDocument>(
	{
		customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
		provider: {
			type: String,
			enum: Object.values(PaymentProvider),
			default: PaymentProvider.STRIPE,
			required: true,
		},
		provider_customer_id: { type: String, required: true, trim: true },
		provider_payment_method_id: { type: String, required: true, trim: true },
		type: {
			type: String,
			enum: Object.values(PaymentMethodType),
			default: PaymentMethodType.CARD,
			required: true,
		},
		brand: { type: String, required: true },
		last4: { type: String, required: true },
		exp_month: { type: Number, required: true, min: 1, max: 12 },
		exp_year: { type: Number, required: true },
		wallet: {
			type: String,
			enum: ["apple_pay", "google_pay"],
			default: null,
		},
		is_default: { type: Boolean, default: false },
		deleted_at: { type: Date },
		deleted_by: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

paymentMethodSchema.index(
	{ customer_id: 1 },
	{ name: "payment_methods_customer" }
)

paymentMethodSchema.index(
	{ customer_id: 1, provider_payment_method_id: 1 },
	{ name: "payment_methods_customer_provider_unique", unique: true }
)

paymentMethodSchema.index(
	{ customer_id: 1, is_default: 1 },
	{ name: "payment_methods_default_lookup" }
)

export default mongoose.models.CustomerPaymentMethod ||
	model<CustomerPaymentMethodDocument>("CustomerPaymentMethod", paymentMethodSchema, "customer_payment_methods")
