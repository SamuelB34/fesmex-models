import mongoose, { Schema, model } from "mongoose"

export interface SapOrderType {
	doc_entry: number
	doc_num?: number | null
	doc_date?: Date | null
	doc_due_date?: Date | null
	tax_date?: Date | null
	doc_time?: number | null
	update_date?: Date | null
	update_time?: number | null
	card_code?: string | null
	card_name?: string | null
	doc_total?: number | null
	doc_total_fc?: number | null
	doc_total_sys?: number | null
	doc_currency?: string | null
	doc_rate?: number | null
	sales_person_code?: number | null
	vat_sum?: number | null
	cancelled?: string | null
	document_status?: string | null
	created_at?: Date
	updated_at?: Date
}

const sapOrderSchema = new Schema<SapOrderType>(
	{
		doc_entry: { type: Number, required: true, unique: true },
		doc_num: { type: Number, index: true },
		doc_date: { type: Date, index: true },
		doc_due_date: { type: Date },
		tax_date: { type: Date },
		doc_time: { type: Number },
		update_date: { type: Date, index: true },
		update_time: { type: Number },
		card_code: { type: String, index: true },
		card_name: { type: String },
		doc_total: { type: Number },
		doc_total_fc: { type: Number },
		doc_total_sys: { type: Number },
		doc_currency: { type: String },
		doc_rate: { type: Number },
		sales_person_code: { type: Number, index: true },
		vat_sum: { type: Number },
		cancelled: { type: String },
		document_status: { type: String },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

sapOrderSchema.index(
	{ document_status: 1, cancelled: 1 },
	{ name: "sap_orders_document_status_cancelled" }
)

export default mongoose.models.SapOrder ||
	model<SapOrderType>("SapOrder", sapOrderSchema, "sap_orders")
