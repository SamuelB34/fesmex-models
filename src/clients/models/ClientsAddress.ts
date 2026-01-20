import { Schema, model, models, Types } from "mongoose"

export interface ClientAddressType {
	client_id: Types.ObjectId
	address_name?: string | null
	street?: string | null
	neighborhood?: string | null
	postal_code?: string | null
	city?: string | null
	state?: string | null
	country?: string | null
	created_at?: Date
	updated_at?: Date
}

const clientAddressSchema = new Schema<ClientAddressType>(
	{
		client_id: {
			type: Schema.Types.ObjectId,
			ref: "Client",
			required: true,
			index: true,
		},
		address_name: { type: String },
		street: { type: String },
		neighborhood: { type: String },
		postal_code: { type: String },
		city: { type: String },
		state: { type: String },
		country: { type: String },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default models.ClientAddress || model<ClientAddressType>(
	"ClientAddress",
	clientAddressSchema,
	"client_addresses"
)
