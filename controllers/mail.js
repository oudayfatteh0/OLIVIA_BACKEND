const Mail = require('../models/mail.js');

exports.sendMail = async (req, res) => {
	try {
		const newMail = new Mail({
			email: req.body.email,
			phoneNumber: req.body.phoneNumber,
			name: req.body.name,
			subject: req.body.subject,
			message: req.body.message,
			read: false,
			status: 'pending',
			itemReference: req.body.itemReference,
		});
		await newMail.save();
		res.status(201).json({ message: 'Mail sent successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getAllMails = async (req, res) => {
	try {
		const mails = await Mail.find().sort({ date: -1 });
		res.status(200).json(mails);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteMail = async (req, res) => {
	try {
		const { id } = req.params;
		await Mail.findByIdAndDelete(id);
		res.status(200).json({ message: 'Mail deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getUnreadCount = async (req, res) => {
	try {
		const count = await Mail.countDocuments({ read: false });
		res.status(200).json({ count });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.markAsRead = async (req, res) => {
	try {
		const { id } = req.params;
		await Mail.findByIdAndUpdate(id, { read: true });
		res.status(200).json({ message: 'Mail marked as read successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.markAllAsRead = async (req, res) => {
	try {
		await Mail.updateMany({}, { read: true });
		res.status(200).json({ message: 'All mails marked as read successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.changeStatus = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body;
		console.log(id, status);
		await Mail.findByIdAndUpdate(id, { status });
		res.status(200).json({ message: 'Mail status changed successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
