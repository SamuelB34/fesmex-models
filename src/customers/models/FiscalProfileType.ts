import mongoose, { Schema, model } from "mongoose"

export interface FiscalProfileType {
	customer_id: mongoose.Types.ObjectId
	rfc: string
	razon_social: string
	uso_cfdi: string
	regimen_fiscal: string
	cp: string // código postal
	created_at: Date
	updated_at?: Date
}

const fiscalProfileSchema = new Schema<FiscalProfileType>({
	customer_id: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
	rfc: { type: String, required: true },
	razon_social: { type: String, required: true },
	uso_cfdi: { type: String, required: true },
	regimen_fiscal: { type: String, required: true },
	cp: { type: String, required: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
})

export default mongoose.models.FiscalProfile || model<FiscalProfileType>("FiscalProfile", fiscalProfileSchema, "fiscal_profiles")
