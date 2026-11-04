import mongoose, { Schema, model } from "mongoose";

/**
 * Line-level origin resolution, computed during synchronization from the
 * raw SAP base references (base_type/base_entry/base_line):
 * - "resolved"      : originating Order established (order_doc_entry/line_num set)
 * - "unresolved"    : base refs exist but the Order could not be established
 *                    (e.g. Delivery or its line missing — retryable)
 * - "not_applicable": no base refs, or refs that provably do not come
 *                    from a Sales Order
 */
export type SapInvoiceLineRelationStatus =
  "resolved" | "unresolved" | "not_applicable";

export interface SapInvoiceLineType {
  doc_entry: number;
  line_num: number;
  item_code?: string | null;
  item_description?: string | null;
  quantity?: number | null;
  ship_date?: Date | null;
  price?: number | null;
  unit_price?: number | null;
  discount_percent?: number | null;
  currency?: string | null;
  rate?: number | null;
  line_total?: number | null;
  row_total_fc?: number | null;
  row_total_sc?: number | null;
  tax_code?: string | null;
  tax_percentage_per_row?: number | null;
  tax_total?: number | null;
  price_after_vat?: number | null;
  tax_liable?: string | null;
  gross_total?: number | null;
  gross_total_fc?: number | null;
  gross_total_sc?: number | null;
  gross_profit?: number | null;
  gross_profit_fc?: number | null;
  gross_profit_sc?: number | null;
  gross_profit_total_base_price?: number | null;
  gross_buy_price?: number | null;
  sales_person_code?: number | null;
  warehouse_code?: string | null;
  costing_code?: string | null;
  cogs_costing_code?: string | null;
  cogs_account_code?: string | null;
  account_code?: string | null;
  project_code?: string | null;
  measure_unit?: string | null;
  units_of_measurement?: number | null;
  line_status?: string | null;
  remaining_open_quantity?: number | null;
  actual_delivery_date?: Date | null;
  u_pl?: number | null;
  u_costo?: number | null;
  u_porgan?: number | null;
  u_mult?: number | null;
  base_type?: number | null;
  base_entry?: number | null;
  base_line?: number | null;
  order_doc_entry?: number | null;
  order_line_num?: number | null;
  delivery_doc_entry?: number | null;
  delivery_line_num?: number | null;
  relation_status?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

const sapInvoiceLineSchema = new Schema<SapInvoiceLineType>(
  {
    doc_entry: { type: Number, required: true },
    line_num: { type: Number, required: true },
    item_code: { type: String, index: true },
    item_description: { type: String },
    quantity: { type: Number },
    ship_date: { type: Date, index: true },
    price: { type: Number },
    unit_price: { type: Number },
    discount_percent: { type: Number },
    currency: { type: String },
    rate: { type: Number },
    line_total: { type: Number },
    row_total_fc: { type: Number },
    row_total_sc: { type: Number },
    tax_code: { type: String },
    tax_percentage_per_row: { type: Number },
    tax_total: { type: Number },
    price_after_vat: { type: Number },
    tax_liable: { type: String },
    gross_total: { type: Number },
    gross_total_fc: { type: Number },
    gross_total_sc: { type: Number },
    gross_profit: { type: Number },
    gross_profit_fc: { type: Number },
    gross_profit_sc: { type: Number },
    gross_profit_total_base_price: { type: Number },
    gross_buy_price: { type: Number },
    sales_person_code: { type: Number, index: true },
    warehouse_code: { type: String, index: true },
    costing_code: { type: String },
    cogs_costing_code: { type: String },
    cogs_account_code: { type: String },
    account_code: { type: String },
    project_code: { type: String },
    measure_unit: { type: String },
    units_of_measurement: { type: Number },
    line_status: { type: String },
    remaining_open_quantity: { type: Number },
    actual_delivery_date: { type: Date },
    u_pl: { type: Number },
    u_costo: { type: Number },
    u_porgan: { type: Number },
    u_mult: { type: Number },
    base_type: { type: Number },
    base_entry: { type: Number },
    base_line: { type: Number },
    order_doc_entry: { type: Number },
    order_line_num: { type: Number },
    delivery_doc_entry: { type: Number },
    delivery_line_num: { type: Number },
    relation_status: { type: String, index: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

sapInvoiceLineSchema.index(
  { doc_entry: 1, line_num: 1 },
  { name: "sap_invoice_lines_doc_entry_line_num_unique", unique: true },
);

sapInvoiceLineSchema.index(
  { order_doc_entry: 1, order_line_num: 1 },
  { name: "sap_invoice_lines_order_doc_entry_line_num" },
);

sapInvoiceLineSchema.index(
  { base_type: 1, base_entry: 1 },
  { name: "sap_invoice_lines_base_type_base_entry" },
);

sapInvoiceLineSchema.index(
  { line_status: 1, remaining_open_quantity: 1 },
  { name: "sap_invoice_lines_line_status_remaining_open" },
);

export default mongoose.models.SapInvoiceLine ||
  model<SapInvoiceLineType>(
    "SapInvoiceLine",
    sapInvoiceLineSchema,
    "sap_invoice_lines",
  );
