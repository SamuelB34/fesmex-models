import { Schema, model, models, Document, Types } from "mongoose"

/**
 * Sync Log Types
 */
export enum SyncLogType {
	SAP_QUOTATION = "SAP_QUOTATION",
	SAP_SALES_ORDER = "SAP_SALES_ORDER",
	PIPEDRIVE = "PIPEDRIVE",
}

export enum SyncLogStatus {
	PENDING = "PENDING",
	SUCCESS = "SUCCESS",
	FAILED = "FAILED",
	RETRYING = "RETRYING",
}

export enum SyncLogAction {
	CREATE = "CREATE",
	UPDATE = "UPDATE",
	DELETE = "DELETE",
}

export interface ISyncLog extends Document {
	_id: Types.ObjectId
	entity_type: string
	entity_id: Types.ObjectId
	sync_type: SyncLogType
	action: SyncLogAction
	status: SyncLogStatus
	error_message?: string
	error_code?: string
	error_details?: Record<string, any>
	request_payload?: Record<string, any>
	response_payload?: Record<string, any>
	retry_count: number
	max_retries: number
	next_retry_at?: Date
	created_at: Date
	updated_at: Date
	resolved_at?: Date
	resolved_by?: Types.ObjectId
}

const syncLogSchema = new Schema(
	{
		entity_type: {
			type: String,
			required: true,
			index: true,
		},
		entity_id: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true,
		},
		sync_type: {
			type: String,
			enum: Object.values(SyncLogType),
			required: true,
			index: true,
		},
		action: {
			type: String,
			enum: Object.values(SyncLogAction),
			required: true,
		},
		status: {
			type: String,
			enum: Object.values(SyncLogStatus),
			default: SyncLogStatus.PENDING,
			index: true,
		},
		error_message: { type: String },
		error_code: { type: String },
		error_details: { type: Schema.Types.Mixed },
		request_payload: { type: Schema.Types.Mixed },
		response_payload: { type: Schema.Types.Mixed },
		retry_count: { type: Number, default: 0 },
		max_retries: { type: Number, default: 3 },
		next_retry_at: { type: Date },
		resolved_at: { type: Date },
		resolved_by: { type: Schema.Types.ObjectId, ref: "User" },
	},
	{
		timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
	}
)

syncLogSchema.index({ entity_type: 1, entity_id: 1, status: 1 })
syncLogSchema.index({ status: 1, next_retry_at: 1 })

export const SyncLog = models.SyncLog || model<ISyncLog>("SyncLog", syncLogSchema, "sync_logs")
