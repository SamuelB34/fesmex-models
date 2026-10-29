import mongoose, { Schema, model } from "mongoose"

export interface SapOrderLineType {
	doc_entry: number
	line_num: number
	item_code?: string | null
	item_description?: string | null
	quantity?: number | null
	remaining_open_quantity?: number | null
	ship_date?: Date | null
	price?: number | null
	discount_percent?: number | null
	line_total?: number | null
	row_total_fc?: number | null
	currency?: string | null
	rate?: number | null
	gross_profit?: number | null
	sales_person_code?: number | null
	warehouse_code?: string | null
	line_status?: string | null
	created_at?: Date
	updated_at?: Date
}

const sapOrderLineSchema = new Schema<SapOrderLineType>(
	{
		doc_entry: { type: Number, required: true },
		line_num: { type: Number, required: true },
		item_code: { type: String, index: true },
		item_description: { type: String },
		quantity: { type: Number },
		remaining_open_quantity: { type: Number },
		ship_date: { type: Date, index: true },
		price: { type: Number },
		discount_percent: { type: Number },
		line_total: { type: Number },
		row_total_fc: { type: Number },
		currency: { type: String },
		rate: { type: Number },
		gross_profit: { type: Number },
		sales_person_code: { type: Number, index: true },
		warehouse_code: { type: String, index: true },
		line_status: { type: String },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

sapOrderLineSchema.index(
	{ doc_entry: 1, line_num: 1 },
	{ name: "sap_order_lines_doc_entry_line_num_unique", unique: true }
)

sapOrderLineSchema.index(
	{ line_status: 1, remaining_open_quantity: 1 },
	{ name: "sap_order_lines_line_status_remaining_open" }
)

export default mongoose.models.SapOrderLine ||
	model<SapOrderLineType>("SapOrderLine", sapOrderLineSchema, "sap_order_lines")
