const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	reference: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
