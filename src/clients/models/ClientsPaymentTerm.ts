import { Schema, model, models, Types } from "mongoose"

export interface ClientPaymentTermType {
	client_id: Types.ObjectId
	code?: string | null
	name?: string | null
	created_at?: Date
	updated_at?: Date
}

const clientPaymentTermSchema = new Schema<ClientPaymentTermType>(
	{
		client_id: {
			type: Schema.Types.ObjectId,
			ref: "Client",
			required: true,
			unique: true,
		},
		code: { type: String },
		name: { type: String },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default models.ClientPaymentTerm || model<ClientPaymentTermType>(
	"ClientPaymentTerm",
	clientPaymentTermSchema,
	"client_payment_terms"
)
