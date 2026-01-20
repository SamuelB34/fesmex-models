import mongoose, { Schema, model, models } from "mongoose"
import bcrypt from "bcryptjs"

export enum CustomerStatus {
	ACTIVE = "active",
	INACTIVE = "inactive",
	BANNED = "banned",
}

export interface CustomerType {
	first_name: string
	last_name: string
	email: string
	mobile?: string
	password: string
	status: CustomerStatus
	fiscal_profile_id?: mongoose.Types.ObjectId
	created_at: Date
	updated_at?: Date
	deleted_at?: Date
}

const customerSchema = new Schema<CustomerType>({
	first_name: { type: String, required: true },
	last_name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	mobile: { type: String },
	password: { type: String, required: true, select: false },
	status: {
		type: String,
		enum: Object.values(CustomerStatus),
		default: CustomerStatus.ACTIVE,
	},
	fiscal_profile_id: { type: Schema.Types.ObjectId, ref: "FiscalProfile" },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
	deleted_at: { type: Date },
})

// Hash password
customerSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		this.password = await bcrypt.hash(this.password, 12)
	}
	next()
})

export default models.Customer || model<CustomerType>("Customer", customerSchema, "customers")
