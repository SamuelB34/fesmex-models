import { Schema, model, models, Types } from "mongoose"

export interface ClientSalesEmployeeType {
	client_id: Types.ObjectId
	employee_code?: string | null
	employee_name?: string | null
	created_at?: Date
	updated_at?: Date
}

const clientSalesEmployeeSchema = new Schema<ClientSalesEmployeeType>(
	{
		client_id: {
			type: Schema.Types.ObjectId,
			ref: "Client",
			required: true,
			unique: true,
		},
		employee_code: { type: String },
		employee_name: { type: String },
	},
	{ timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
)

export default models.ClientSalesEmployee || model<ClientSalesEmployeeType>(
	"ClientSalesEmployee",
	clientSalesEmployeeSchema,
	"client_sales_employees"
)
