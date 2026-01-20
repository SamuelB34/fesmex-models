import { Schema, model, models, Types } from "mongoose"

export interface ClientPriceListType {
	client_id: Types.ObjectId
	number?: string | null
	name?: string | null
	created_at?: Date
	updated_at?: Date
}

const clientPriceListSchema = new Schema<ClientPriceListType>(
	{
		client_id: {
			type: Schema.Types.ObjectId,
			ref: "Client",
			required: true,
			unique: true,
		},
		number: { type: String },
		name: { type: String },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default models.ClientPriceList || model<ClientPriceListType>(
	"ClientPriceList",
	clientPriceListSchema,
	"client_price_lists"
)
