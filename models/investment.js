const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InvestmentSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	proposedPrice: {
		type: Number,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	location: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Investment = mongoose.model('Investment', InvestmentSchema);

module.exports = Investment;
