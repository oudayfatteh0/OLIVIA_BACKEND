const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const JWT_SECRET = process.env.JWT_SECRET || 'olivia_default';

exports.login = async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: 'Invalid password' });
		}

		const token = jwt.sign({ userId: user._id, name: user.name, type: user.userType }, JWT_SECRET, {
			expiresIn: '1h',
		});

		res.json({
			message: 'Login successful',
			token: token,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.register = async (req, res) => {
	const { email, password, name, type } = req.body;

	try {
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ message: 'User already exists' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);
		const newUser = new User({ email, password: hashedPassword, name, userType: type });
		await newUser.save();

		res.status(201).json({ message: 'User created successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
