import mongoose, { Schema, model } from "mongoose"

const tagSchema = new Schema({
	name: { type: String, required: true, trim: true },
	slug: { type: String, required: true, trim: true, lowercase: true },
	type: { type: String, enum: ["filter", "sidebar"], default: "filter", index: true },
	is_active: { type: Boolean, default: true, index: true },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date, default: Date.now },
})

tagSchema.index({ slug: 1 }, { unique: true, name: "tags_slug_unique" })
tagSchema.index({ is_active: 1 }, { name: "tags_active" })
tagSchema.index({ type: 1 }, { name: "tags_type" })

export default mongoose.models.Tag || model("Tag", tagSchema, "tags")
