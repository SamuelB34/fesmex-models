import mongoose, { Schema, model } from "mongoose";

/**
 * Applied down payment drawn on an invoice (SAP DownPaymentsToDraw item).
 * All amounts are raw SAP values — no conversion.
 */
export interface SapInvoiceDownPayment {
  doc_entry?: number | null;
  doc_num?: number | null;
  doc_date?: Date | null;
  amount_to_draw?: number | null;
  tax_to_draw?: number | null;
  gross_amount_to_draw?: number | null;
  amount_to_draw_fc?: number | null;
  amount_to_draw_sc?: number | null;
  tax_to_draw_fc?: number | null;
  tax_to_draw_sc?: number | null;
  gross_amount_to_draw_fc?: number | null;
  gross_amount_to_draw_sc?: number | null;
}

export interface SapInvoiceDocumentReference {
  ref_doc_entr?: number | null;
  ref_doc_num?: number | null;
  ref_obj_type?: string | null;
  remark?: string | null;
}

/**
 * Invoice-level origin resolution, derived from the current persisted
 * invoice lines (never computed from a partially fetched page):
 * - "resolved"   : at least one line resolved to an Order and none unresolved
 * - "partial"    : at least one resolved line and at least one unresolved
 * - "unresolved" : no resolved line and at least one unresolved (retryable)
 * - "none"       : no line has an applicable originating Order
 */
export type SapInvoiceRelationStatus =
  "resolved" | "partial" | "unresolved" | "none";

export interface SapInvoiceType {
  doc_entry: number;
  doc_num?: number | null;
  doc_type?: string | null;
  doc_subtype?: string | null;
  series?: number | null;
  series_string?: string | null;
  doc_date?: Date | null;
  doc_due_date?: Date | null;
  tax_date?: Date | null;
  doc_time?: number | null;
  creation_date?: Date | null;
  update_date?: Date | null;
  update_time?: number | null;
  card_code?: string | null;
  card_name?: string | null;
  contact_person_code?: number | null;
  num_at_card?: string | null;
  sales_person_code?: number | null;
  documents_owner?: number | null;
  doc_currency?: string | null;
  doc_rate?: number | null;
  doc_total?: number | null;
  doc_total_fc?: number | null;
  doc_total_sys?: number | null;
  vat_sum?: number | null;
  vat_sum_fc?: number | null;
  vat_sum_sys?: number | null;
  discount_percent?: number | null;
  total_discount?: number | null;
  total_discount_fc?: number | null;
  total_discount_sc?: number | null;
  paid_to_date?: number | null;
  paid_to_date_fc?: number | null;
  paid_to_date_sys?: number | null;
  down_payment?: number | null;
  down_payment_amount?: number | null;
  down_payment_amount_fc?: number | null;
  down_payment_amount_sc?: number | null;
  down_payment_percentage?: number | null;
  rounding_diff_amount?: number | null;
  rounding_diff_amount_fc?: number | null;
  rounding_diff_amount_sc?: number | null;
  gross_profit?: number | null;
  cancelled?: string | null;
  document_status?: string | null;
  cancel_status?: string | null;
  confirmed?: string | null;
  reserve_invoice?: string | null;
  down_payment_status?: string | null;
  payment_group_code?: number | null;
  payment_method?: string | null;
  payment_reference?: string | null;
  reference_1?: string | null;
  reference_2?: string | null;
  comments?: string | null;
  journal_memo?: string | null;
  project?: string | null;
  folio_prefix_string?: string | null;
  folio_number?: number | null;
  u_noventa?: string | null;
  u_docnumov?: string | null;
  u_occliente?: string | null;
  u_opprid?: string | null;
  u_unidad?: string | null;
  u_clfinal?: string | null;
  u_feventas?: string | null;
  u_referencia?: string | null;
  down_payments?: SapInvoiceDownPayment[];
  document_references?: SapInvoiceDocumentReference[];
  order_doc_entries?: number[];
  relation_status?: string | null;
  created_at?: Date;
  updated_at?: Date;
}

const sapInvoiceDownPaymentSchema = new Schema<SapInvoiceDownPayment>(
  {
    doc_entry: { type: Number },
    doc_num: { type: Number },
    doc_date: { type: Date },
    amount_to_draw: { type: Number },
    tax_to_draw: { type: Number },
    gross_amount_to_draw: { type: Number },
    amount_to_draw_fc: { type: Number },
    amount_to_draw_sc: { type: Number },
    tax_to_draw_fc: { type: Number },
    tax_to_draw_sc: { type: Number },
    gross_amount_to_draw_fc: { type: Number },
    gross_amount_to_draw_sc: { type: Number },
  },
  { _id: false },
);

const sapInvoiceDocumentReferenceSchema =
  new Schema<SapInvoiceDocumentReference>(
    {
      ref_doc_entr: { type: Number },
      ref_doc_num: { type: Number },
      ref_obj_type: { type: String },
      remark: { type: String },
    },
    { _id: false },
  );

const sapInvoiceSchema = new Schema<SapInvoiceType>(
  {
    doc_entry: { type: Number, required: true, unique: true },
    doc_num: { type: Number, index: true },
    doc_type: { type: String },
    doc_subtype: { type: String },
    series: { type: Number },
    series_string: { type: String, default: null },
    doc_date: { type: Date, index: true },
    doc_due_date: { type: Date },
    tax_date: { type: Date },
    doc_time: { type: Number },
    creation_date: { type: Date },
    update_date: { type: Date, index: true },
    update_time: { type: Number },
    card_code: { type: String, index: true },
    card_name: { type: String },
    contact_person_code: { type: Number, default: null },
    num_at_card: { type: String, default: null },
    sales_person_code: { type: Number, index: true },
    documents_owner: { type: Number, default: null },
    doc_currency: { type: String },
    doc_rate: { type: Number },
    doc_total: { type: Number },
    doc_total_fc: { type: Number },
    doc_total_sys: { type: Number },
    vat_sum: { type: Number },
    vat_sum_fc: { type: Number, default: null },
    vat_sum_sys: { type: Number, default: null },
    discount_percent: { type: Number, default: null },
    total_discount: { type: Number, default: null },
    total_discount_fc: { type: Number, default: null },
    total_discount_sc: { type: Number, default: null },
    paid_to_date: { type: Number, default: null },
    paid_to_date_fc: { type: Number, default: null },
    paid_to_date_sys: { type: Number, default: null },
    down_payment: { type: Number, default: null },
    down_payment_amount: { type: Number, default: null },
    down_payment_amount_fc: { type: Number, default: null },
    down_payment_amount_sc: { type: Number, default: null },
    down_payment_percentage: { type: Number, default: null },
    rounding_diff_amount: { type: Number, default: null },
    rounding_diff_amount_fc: { type: Number, default: null },
    rounding_diff_amount_sc: { type: Number, default: null },
    gross_profit: { type: Number, default: null },
    cancelled: { type: String },
    document_status: { type: String },
    cancel_status: { type: String },
    confirmed: { type: String },
    reserve_invoice: { type: String },
    down_payment_status: { type: String },
    payment_group_code: { type: Number, default: null },
    payment_method: { type: String, default: null },
    payment_reference: { type: String, default: null },
    reference_1: { type: String, default: null },
    reference_2: { type: String, default: null },
    comments: { type: String, default: null },
    journal_memo: { type: String, default: null },
    project: { type: String, default: null },
    folio_prefix_string: { type: String, default: null },
    folio_number: { type: Number, default: null },
    u_noventa: { type: String, default: null },
    u_docnumov: { type: String, default: null },
    u_occliente: { type: String, default: null },
    u_opprid: { type: String, default: null },
    u_unidad: { type: String, default: null },
    u_clfinal: { type: String, default: null },
    u_feventas: { type: String, default: null },
    u_referencia: { type: String, default: null },
    down_payments: { type: [sapInvoiceDownPaymentSchema], default: [] },
    document_references: {
      type: [sapInvoiceDocumentReferenceSchema],
      default: [],
    },
    order_doc_entries: { type: [Number], index: true, default: [] },
    relation_status: { type: String, index: true, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

sapInvoiceSchema.index(
  { document_status: 1, cancelled: 1 },
  { name: "sap_invoices_document_status_cancelled" },
);

export default mongoose.models.SapInvoice ||
  model<SapInvoiceType>("SapInvoice", sapInvoiceSchema, "sap_invoices");
