const Investment = require('../models/investment.js');
const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true,
});

const generateReference = () => {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let reference = '';
	for (let i = 0; i < 12; i++) {
		reference += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return reference;
};

exports.getAllInvestments = async (req, res) => {
	try {
		const { reference, title } = req.query;

		let query = {};

		if (reference) {
			query.reference = { $regex: reference, $options: 'i' };
		}

		if (title) {
			query.title = { $regex: title, $options: 'i' };
		}

		const investments = await Investment.find(query);

		res.status(200).json(investments);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getInvestmentById = async (req, res) => {
	try {
		const { id } = req.params;

		const investment = await Investment.findOne({ _id: id });
		if (!investment) {
			res.status(404).json({ message: 'Investment not found' });
		} else {
			res.status(200).json(investment);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
exports.createInvestment = async (req, res) => {
	try {
		const investmentData = JSON.parse(req.body.investment);

		const uploadResult = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{ folder: 'investment' },
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				},
			);
			stream.end(req.file.buffer);
		});
		if (uploadResult && uploadResult.secure_url) {
			const reference = generateReference();

			const newInvestment = new Investment({
				title: investmentData.title,
				description: investmentData.description,
				proposedPrice: investmentData.proposedPrice,
				image: uploadResult.secure_url,
				location: investmentData.location,
				reference: reference,
			});
			await newInvestment.save();
			res.status(201).json({ message: 'Investment created successfully' });
		}
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
		const investmentData = JSON.parse(req.body.investment);
		let uploadResult;
		const updateData = {};

		if (investmentData) {
			if (investmentData.title) updateData.title = investmentData.title;
			if (investmentData.description) updateData.description = investmentData.description;
			if (investmentData.proposedPrice) updateData.proposedPrice = investmentData.proposedPrice;
			if (investmentData.location) updateData.location = investmentData.location;
		}

		if (req.file) {
			uploadResult = await new Promise((resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream(
					{ folder: 'investment' },
					(error, result) => {
						if (error) reject(error);
						else resolve(result);
					},
				);
				stream.end(req.file.buffer);
			});
			if (uploadResult && uploadResult.secure_url) {
				updateData.image = uploadResult.secure_url;
			}
		}

		const updatedInvestment = await Investment.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true },
		);

		if (!updatedInvestment) {
			res.status(404).json({ message: 'Investment not found' });
		} else {
			res
				.status(200)
				.json({ message: 'Investment updated successfully', investment: updatedInvestment });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
