import { Schema, model, models } from "mongoose"

export interface ClientType {
	sn_code?: string | null
	sn_name?: string | null
	tax_id?: string | null
	currency?: string | null
	phone_1?: string | null
	email?: string | null
	comments?: string | null
	pipedrive_id?: string | null
	sap_id?: string | null
	deleted_at?: Date | null
	deleted_by?: string | null
	created_at?: Date
	updated_at?: Date
}

const clientSchema = new Schema<ClientType>(
	{
		sn_code: { type: String, index: true },
		sn_name: { type: String, required: true },
		tax_id: { type: String },
		currency: { type: String },
		phone_1: { type: String },
		email: { type: String },
		comments: { type: String },
		pipedrive_id: { type: String },
		sap_id: { type: String },
		deleted_at: { type: Date, default: null },
		deleted_by: { type: String, default: null },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default models.Client || model<ClientType>("Client", clientSchema, "clients")
