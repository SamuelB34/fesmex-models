import mongoose, { Schema, model } from "mongoose"

const currencySchema = new Schema({
	code: { type: String, required: true, unique: true },
	symbol: { type: String, required: true },
	name: { type: String, required: true },
})

export default mongoose.models.Currency || model("Currency", currencySchema, "currencies")
