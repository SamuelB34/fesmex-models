import { Schema, model, models, Types } from "mongoose"

const articlePriceSchema = new Schema({
	article_id: { type: Types.ObjectId, ref: "Article", required: true },
	price_list_id: { type: Types.ObjectId, ref: "PriceList", required: true },
	currency_id: { type: Types.ObjectId, ref: "Currency", required: true },
	price: { type: Number, required: true },
	valid_from: { type: Date },
	valid_to: { type: Date },
	created_at: { type: Date, default: Date.now },
	updated_at: { type: Date },
})

export default models.ArticlePrice || model("ArticlePrice", articlePriceSchema, "article_prices")
