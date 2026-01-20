import { Schema, model, models, Types } from "mongoose"

export interface ClientPaymentMethodType {
	client_id: Types.ObjectId
	code?: string | null
	description?: string | null
	created_at?: Date
	updated_at?: Date
}

const clientPaymentMethodSchema = new Schema<ClientPaymentMethodType>(
	{
		client_id: {
			type: Schema.Types.ObjectId,
			ref: "Client",
			required: true,
			unique: true,
		},
		code: { type: String },
		description: { type: String },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default models.ClientPaymentMethod || model<ClientPaymentMethodType>(
	"ClientPaymentMethod",
	clientPaymentMethodSchema,
	"client_payment_methods"
)
