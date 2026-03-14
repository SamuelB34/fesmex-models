import mongoose, { Schema, model, Types } from "mongoose"

export enum PaymentProvider {
	STRIPE = "stripe",
}

export enum TransactionStatus {
	PENDING = "pending",
	PROCESSING = "processing",
	SUCCEEDED = "succeeded",
	FAILED = "failed",
	REFUNDED = "refunded",
}

export enum TransactionMethod {
	CARD = "card",
	APPLE_PAY = "apple_pay",
	GOOGLE_PAY = "google_pay",
	BANK_TRANSFER = "bank_transfer",
}

export interface OrderPaymentDocument {
	order_id: Types.ObjectId
	customer_id: Types.ObjectId
	payment_method_id?: Types.ObjectId
	provider: PaymentProvider
	provider_payment_id?: string
	provider_payment_intent_id: string
	method: TransactionMethod
	status: TransactionStatus
	amount: number
	currency: string
	created_at: Date
	updated_at?: Date
	deleted_at?: Date
	deleted_by?: Types.ObjectId
}

const orderPaymentSchema = new Schema<OrderPaymentDocument>(
	{
		order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
		customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
		payment_method_id: { type: Schema.Types.ObjectId, ref: "ClientPaymentMethod" },
		provider: {
			type: String,
			enum: Object.values(PaymentProvider),
			default: PaymentProvider.STRIPE,
			required: true,
		},
		provider_payment_id: { type: String },
		provider_payment_intent_id: { type: String, required: true },
		method: {
			type: String,
			enum: Object.values(TransactionMethod),
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(TransactionStatus),
			default: TransactionStatus.PENDING,
			required: true,
		},
		amount: { type: Number, required: true, min: 0 },
		currency: { type: String, required: true, default: "MXN" },
		deleted_at: { type: Date },
		deleted_by: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

orderPaymentSchema.index(
	{ order_id: 1 },
	{ name: "order_payments_order" }
)

orderPaymentSchema.index(
	{ customer_id: 1, created_at: -1 },
	{ name: "order_payments_customer_created" }
)

orderPaymentSchema.index(
	{ provider_payment_intent_id: 1 },
	{
		name: "order_payments_provider_intent_unique",
		unique: true,
		sparse: true
	}
)

orderPaymentSchema.index(
	{ provider_payment_id: 1 },
	{ name: "order_payments_provider_payment_id" }
)

export default mongoose.models.OrderPayment ||
	model<OrderPaymentDocument>("OrderPayment", orderPaymentSchema, "order_payments")
