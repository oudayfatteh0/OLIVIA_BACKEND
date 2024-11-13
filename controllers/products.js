const Product = require('../models/products.js');
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
	for (let i = 0; i < 10; i++) {
		reference += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return reference;
};

exports.getProducts = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const reference = req.query.reference || '';
		const name = req.query.name || '';
		const startIndex = (page - 1) * limit;

		let query = {};

		if (reference) {
			query.reference = { $regex: reference, $options: 'i' };
		}

		if (name) {
			query.name = { $regex: name, $options: 'i' };
		}

		const products = await Product.find(query).limit(limit).skip(startIndex);
		const total = await Product.countDocuments();
		const totalPages = Math.ceil(total / limit);
		res.status(200).json({ products, totalPages });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.getProductById = async (req, res) => {
	try {
		const { id } = req.params;
		console.log(id);
		const product = await Product.findOne({ _id: id });
		if (!product) {
			res.status(404).json({ message: 'Product not found' });
		} else {
			res.status(200).json(product);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.createProduct = async (req, res) => {
	try {
		const productData = JSON.parse(req.body.product);

		const uploadResult = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
				if (error) reject(error);
				else resolve(result);
			});
			stream.end(req.file.buffer);
		});

		if (uploadResult && uploadResult.secure_url) {
			const reference = generateReference();

			const newProduct = new Product({
				name: productData.name,
				description: productData.description,
				price: productData.price,
				image: uploadResult.secure_url,
				reference: reference,
			});

			await newProduct.save();
			res.status(201).json({ message: 'Product created successfully', product: newProduct });
		} else {
			res.status(500).json({ message: 'Something went wrong with the image upload' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.updateProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const productData = JSON.parse(req.body.product);
		let uploadResult;
		const updateData = {};

		if (productData) {
			if (productData.name) updateData.name = productData.name;
			if (productData.description) updateData.description = productData.description;
			if (productData.price) updateData.price = productData.price;
		}

		if (req.file) {
			uploadResult = await new Promise((resolve, reject) => {
				const stream = cloudinary.uploader.upload_stream(
					{ folder: 'products' },
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

		const updatedProduct = await Product.findByIdAndUpdate(
			id,
			{ $set: updateData },
			{ new: true, runValidators: true },
		);

		if (!updatedProduct) {
			res.status(404).json({ message: 'Product not found' });
		} else {
			res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.deleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await Product.findByIdAndDelete(id);
		if (!product) {
			res.status(404).json({ message: 'Product not found' });
		} else {
			res.status(200).json({ message: 'Product deleted successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
