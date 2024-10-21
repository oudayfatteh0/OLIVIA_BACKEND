const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebSettingsSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	logo: {
		type: String,
		required: true,
	},
	favicon: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
});

const WebSettings = mongoose.model('WebSettings', WebSettingsSchema);

module.exports = WebSettings;
