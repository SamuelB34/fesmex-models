import mongoose, { Schema, model } from "mongoose"
import bcrypt from "bcryptjs"

export enum UserRole {
    ADMIN = "admin",
    SALES = "sales",
    TECHNICIAN = "technician",
    WAREHOUSEMAN = "warehouseman",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
}

export interface UserType {
    first_name: string
    middle_name?: string
    last_name: string
    username: string
    password: string
    role: UserRole
    status: UserStatus
    email?: string
    mobile?: string
    pipedrive_id?: string
    sap_employee_id?: string
    sap_id?: string
    created_at: Date
    created_by?: mongoose.Types.ObjectId | string
    updated_at?: Date
    updated_by?: mongoose.Types.ObjectId
    deleted_at?: Date
    deleted_by?: mongoose.Types.ObjectId
}

const usersSchema = new Schema<UserType>({
    first_name: { type: String, required: true },
    middle_name: { type: String },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.SALES,
    },
    status: {
        type: String,
        enum: Object.values(UserStatus),
        default: UserStatus.ACTIVE,
    },
    email: { type: String },
    mobile: { type: String },
    pipedrive_id: { type: String },
    sap_id: { type: String },
    sap_employee_id: { type: String },
    created_at: { type: Date, default: Date.now },
    created_by: { type: Schema.Types.Mixed, ref: "User" },
    updated_at: { type: Date },
    updated_by: { type: Schema.Types.ObjectId, ref: "User" },
    deleted_at: { type: Date },
    deleted_by: { type: Schema.Types.ObjectId, ref: "User" },
})

usersSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12)
    }
})

export default mongoose.models.User || model<UserType>("User", usersSchema, "users")
