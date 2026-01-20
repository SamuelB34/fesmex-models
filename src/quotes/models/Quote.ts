import { Schema, model, models } from "mongoose"

export enum QuoteStatus {
	OPPORTUNITY = "OPPORTUNITY",
	QUOTE = "QUOTE",
	FOLLOWING = "FOLLOWING",
	NEGOTIATION = "NEGOTIATION",
}

export enum Status {
	OPEN = "OPEN",
	WIN = "WIN",
	LOST = "LOST",
	DELETE = "DELETE",
}

export enum CreatedMethod {
	MANUAL = "MANUAL",
	CSV = "CSV",
}

const quoteSchema = new Schema(
	{
		quote_number: { type: Number, required: true },
		quote_revision: { type: Number, default: 0 },
		quote_ref: { type: String },
		company: { type: String },
		company_id: { type: Schema.Types.ObjectId, ref: "Client", required: true },
		company_pipedrive_id: { type: String },
		contact_id: { type: Schema.Types.ObjectId, ref: "ClientContact" },
		project_name: { type: String },
		project_lab: { type: String },
		payment_condition: { type: String },
		payment_exp: { type: String },
		terms_ids: [{ type: Schema.Types.ObjectId, ref: "QuoteTerm" }],
		currency_id: { type: Schema.Types.ObjectId, ref: "Currency" },
		iva: { type: String },
		date: { type: Date },
		status: { type: String, enum: Object.values(Status), default: Status.OPEN },
		quote_status: {
			type: String,
			enum: Object.values(QuoteStatus),
			default: QuoteStatus.OPPORTUNITY,
		},
		sap_id: { type: String },
		sap_quotation_entry: { type: Number },
		sap_order_entry: { type: Number },
		pipedrive_id: { type: String },
		should_sync: { type: Boolean, default: false },
		pdf_download_link: { type: String },
		notes: { type: String },
		created_method: {
			type: String,
			enum: Object.values(CreatedMethod),
			default: CreatedMethod.MANUAL,
		},
		created_by: { type: Schema.Types.ObjectId, ref: "User" },
		updated_by: { type: Schema.Types.ObjectId, ref: "User" },
		deleted_by: { type: Schema.Types.ObjectId, ref: "User" },
		deleted_at: { type: Date },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default models.Quote || model("Quote", quoteSchema, "quotes")
