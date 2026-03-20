import mongoose, { Schema, model } from "mongoose"

export interface StateType {
	_id?: mongoose.Types.ObjectId
	name: string
	code?: string
	percentage: number
	is_active: boolean
	created_at?: Date
	updated_at?: Date
}

const stateSchema = new Schema<StateType>(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			index: true,
		},
		code: {
			type: String,
			trim: true,
			uppercase: true,
			sparse: true,
		},
		percentage: {
			type: Number,
			required: true,
			default: 0.1,
			min: 0,
			max: 1,
		},
		is_active: {
			type: Boolean,
			default: true,
			index: true,
		},
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
)

stateSchema.index({ name: 1, is_active: 1 }, { name: "states_name_active" })

export default mongoose.models.State || model<StateType>("State", stateSchema, "states")
