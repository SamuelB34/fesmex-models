import mongoose, { Schema, model, Types } from "mongoose"

const inventoryStockSchema = new Schema({
	article_id: { type: Types.ObjectId, ref: "Article", required: true },
	warehouse_id: { type: Types.ObjectId, ref: "Warehouse", required: true },
	count: { type: Number, required: true },
	min_stock: { type: Number },
	max_stock: { type: Number },
	updated_at: { type: Date, default: Date.now },
})

export default mongoose.models.InventoryStock || model("InventoryStock", inventoryStockSchema, "inventory_stocks")
