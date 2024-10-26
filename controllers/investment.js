const Investment = require('../models/investment.js');

exports.getAllInvestments = async (req, res) => {
	try {
		const investments = await Investment.find();
		res.status(200).json(investments);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.createInvestment = async (req, res) => {
	const { title, description, proposedPrice, image, location } = req.body;
	try {
		const newInvestment = new Investment({
			title,
			description,
			proposedPrice,
			image,
			location,
		});
		await newInvestment.save();
		res.status(201).json({ message: 'Investment created successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteInvestment = async (req, res) => {
	try {
		const { id } = req.params;
		await Investment.findByIdAndDelete(id);
		res.status(200).json({ message: 'Investment deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.updateInvestment = async (req, res) => {
	try {
		const { id } = req.params;
		const { title, description, proposedPrice, image, location } = req.body;
		await Investment.findByIdAndUpdate(id, { title, description, proposedPrice, image, location });
		res.status(200).json({ message: 'Investment updated successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
