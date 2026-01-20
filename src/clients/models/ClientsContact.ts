import mongoose, { Schema, model, Types } from "mongoose"

export interface ClientContactType {
	client_id: Types.ObjectId
	contact_person_name?: string | null
	first_name?: string | null
	last_name?: string | null
	contact_phone?: string | null
	contact_email?: string | null
	pipedrive_id?: string | null
	created_at?: Date
	updated_at?: Date
}

const clientContactSchema = new Schema<ClientContactType>(
	{
		client_id: {
			type: Schema.Types.ObjectId,
			ref: "Client",
			required: true,
			index: true,
		},
		contact_person_name: { type: String },
		first_name: { type: String },
		last_name: { type: String },
		contact_phone: { type: String },
		contact_email: { type: String },
		pipedrive_id: { type: String },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default mongoose.models.ClientContact || model<ClientContactType>("ClientContact", clientContactSchema, "client_contacts")