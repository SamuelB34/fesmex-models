import mongoose, { Schema, model } from "mongoose"
import { UserRole } from "../../users/models/Users"

export interface AnnouncementType {
	created_by: mongoose.Types.ObjectId
	updated_by?: mongoose.Types.ObjectId
	deleted_by?: mongoose.Types.ObjectId

	created_at: Date
	updated_at?: Date
	deleted_at?: Date

	title: string
	text: string
	roles: UserRole[]
}

const announcementSchema = new Schema<AnnouncementType>({
	created_by: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	updated_by: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	deleted_by: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},

	created_at: {
		type: Date,
		default: Date.now,
	},
	updated_at: Date,
	deleted_at: Date,

	title: {
		type: String,
		required: true,
		trim: true,
	},
	text: {
		type: String,
		required: true,
		trim: true,
	},
	roles: {
		type: [String],
		enum: Object.values(UserRole),
		required: true,
		validate: {
			validator: (roles: UserRole[]) => roles.length > 0,
			message: "At least one user role must be assigned.",
		},
	},
})

export default mongoose.models.Announcement || model<AnnouncementType>("Announcement", announcementSchema, "announcements")
