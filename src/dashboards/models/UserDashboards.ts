import mongoose, { Schema, model, Types } from "mongoose"

export interface UserDashboardConfig {
	schema_version: number
	[key: string]: unknown
}

export interface UserDashboardType {
	owner_id: Schema.Types.ObjectId
	name: string
	is_default: boolean
	revision: number
	config: UserDashboardConfig
	shared_with_admin_ids: Schema.Types.ObjectId[]
	created_at?: Date
	updated_at?: Date
	deleted_at?: Date
	deleted_by?: Schema.Types.ObjectId
}

const userDashboardSchema = new Schema<UserDashboardType>(
	{
		owner_id: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},
		name: { type: String, required: true, trim: true },
		is_default: { type: Boolean, default: false },
		revision: { type: Number, default: 0 },
		// Shape abierto a propósito: el catálogo de campos/widgets aún no
		// está cerrado; el BE valida el contenido con Zod (allowlists).
		config: { type: Schema.Types.Mixed, required: true },
		shared_with_admin_ids: {
			type: [{ type: Types.ObjectId, ref: "User" }],
			default: [],
		},
		deleted_at: { type: Date },
		deleted_by: { type: Types.ObjectId, ref: "User" },
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
)

// Listado por propietario
userDashboardSchema.index(
	{ owner_id: 1, deleted_at: 1, updated_at: -1 },
	{ name: "user_dashboards_owner_updated" }
)
// Dashboards compartidos con un admin
userDashboardSchema.index(
	{ shared_with_admin_ids: 1, deleted_at: 1 },
	{ name: "user_dashboards_shared_admin" }
)
// Un solo predeterminado por propietario, solo entre activos
userDashboardSchema.index(
	{ owner_id: 1 },
	{
		unique: true,
		name: "user_dashboards_default_per_owner",
		partialFilterExpression: { is_default: true, deleted_at: null },
	}
)

export default mongoose.models.UserDashboard ||
	model<UserDashboardType>(
		"UserDashboard",
		userDashboardSchema,
		"user_dashboards"
	)
