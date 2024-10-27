const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MailSchema = new Schema({
	email: {
		type: String,
		required: true,
	},
	phoneNumber: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	subject: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	read: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		default: 'pending',
	},
	itemReference: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const Mail = mongoose.model('Mail', MailSchema);

module.exports = Mail;
