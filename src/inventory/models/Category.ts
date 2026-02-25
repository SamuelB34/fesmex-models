import mongoose, { Schema, model, Types } from "mongoose"

const categorySchema = new Schema({
	name: { type: String, required: true, trim: true },
	slug: { type: String, required: true, trim: true, lowercase: true },
	parent_id: { type: Types.ObjectId, ref: "Category", default: null, index: true },
	order: { type: Number, default: 0 },
	is_active: { type: Boolean, default: true, index: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
})

categorySchema.index({ slug: 1 }, { unique: true, name: "categories_slug_unique" })
categorySchema.index({ parent_id: 1 }, { name: "categories_parent" })
categorySchema.index({ is_active: 1 }, { name: "categories_active" })

export default mongoose.models.Category || model("Category", categorySchema, "categories")
