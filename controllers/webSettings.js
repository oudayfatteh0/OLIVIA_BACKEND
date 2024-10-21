const WebSettings = require('../models/webSettings.js');

exports.changeWebSettings = async (req, res) => {
	const { name, description, logo, favicon, color } = req.body;
	try {
		const webSettings = await WebSettings.findOne();
		if (!webSettings) {
			const newWebSettings = new WebSettings({
				name,
				description,
				logo,
				favicon,
				color,
			});
			await newWebSettings.save();
			res.status(200).json({ message: 'Web settings updated successfully' });
		} else {
			webSettings.name = name;
			webSettings.description = description;
			webSettings.logo = logo;
			webSettings.favicon = favicon;
			webSettings.color = color;
			await webSettings.save();
			res.status(200).json({ message: 'Web settings updated successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error', error: error });
	}
};

exports.getWebSettings = async (req, res) => {
	try {
		const webSettings = await WebSettings.findOne();
		if (!webSettings) {
			res.status(404).json({ message: 'Web settings not found' });
		} else {
			res.status(200).json(webSettings);
		}
	} catch (error) {
		console.error(error, process.env.MONGO_USER, process.env.MONGO_PASS);
		res.status(500).json({
			message: 'Server error',
			user: process.env.MONGO_USER,
			pass: process.env.MONGO_PASS,
		});
	}
};
