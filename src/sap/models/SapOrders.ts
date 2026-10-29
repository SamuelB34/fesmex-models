import mongoose, { Schema, model } from "mongoose"

export interface SapOrderType {
	doc_entry: number
	doc_num?: number | null
	series?: number | null
	series_string?: string | null
	doc_date?: Date | null
	doc_due_date?: Date | null
	tax_date?: Date | null
	doc_time?: number | null
	update_date?: Date | null
	update_time?: number | null
	card_code?: string | null
	card_name?: string | null
	contact_person_code?: number | null
	num_at_card?: string | null
	u_occliente?: string | null
	doc_total?: number | null
	doc_total_fc?: number | null
	doc_total_sys?: number | null
	doc_currency?: string | null
	doc_rate?: number | null
	discount_percent?: number | null
	total_discount?: number | null
	total_discount_fc?: number | null
	total_discount_sc?: number | null
	sales_person_code?: number | null
	vat_sum?: number | null
	vat_sum_fc?: number | null
	vat_sum_sys?: number | null
	cancelled?: string | null
	document_status?: string | null
	created_at?: Date
	updated_at?: Date
}

const sapOrderSchema = new Schema<SapOrderType>(
	{
		doc_entry: { type: Number, required: true, unique: true },
		doc_num: { type: Number, index: true },
		series: { type: Number },
		series_string: { type: String, default: null },
		doc_date: { type: Date, index: true },
		doc_due_date: { type: Date },
		tax_date: { type: Date },
		doc_time: { type: Number },
		update_date: { type: Date, index: true },
		update_time: { type: Number },
		card_code: { type: String, index: true },
		card_name: { type: String },
		contact_person_code: { type: Number, default: null },
		num_at_card: { type: String, default: null },
		u_occliente: { type: String, default: null },
		doc_total: { type: Number },
		doc_total_fc: { type: Number },
		doc_total_sys: { type: Number },
		doc_currency: { type: String },
		doc_rate: { type: Number },
		discount_percent: { type: Number, default: null },
		total_discount: { type: Number, default: null },
		total_discount_fc: { type: Number, default: null },
		total_discount_sc: { type: Number, default: null },
		sales_person_code: { type: Number, index: true },
		vat_sum: { type: Number },
		vat_sum_fc: { type: Number, default: null },
		vat_sum_sys: { type: Number, default: null },
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
