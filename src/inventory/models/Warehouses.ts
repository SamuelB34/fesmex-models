import mongoose, { Schema, model } from "mongoose"

const warehouseSchema = new Schema({
	code: { type: String, required: true, unique: true },
	name: { type: String, required: true },
	location: { type: String },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
})

export default mongoose.models.Warehouse || model("Warehouse", warehouseSchema, "warehouses")
