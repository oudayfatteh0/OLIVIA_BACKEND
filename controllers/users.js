// get users
const bcrypt = require('bcryptjs');
const User = require('../models/user.js');

exports.getUsers = async (req, res) => {
	try {
		const users = await User.find();

		const purgedUsers = users.map((user) => {
			const { password, __v, ...rest } = user.toObject();
			return rest;
		});
		res.status(200).json(purgedUsers);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const { name, oldPassword, newPassword, userType, email, changedPassword } = req.body;

		if (changedPassword) {
			const user = await User.findById(id);
			const isMatch = await bcrypt.compare(oldPassword, user.password);
			if (!isMatch) {
				return res.status(400).json({ message: 'Invalid password' });
			}
			const hashedPassword = await bcrypt.hash(newPassword, 10);
			await User.findByIdAndUpdate(id, { password: hashedPassword, userType, email, name });
			res.status(200).json({ message: 'User updated successfully' });
			return;
		} else {
			await User.findByIdAndUpdate(id, { name, userType, email });
			res.status(200).json({ message: 'User updated successfully' });
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};

// delete user

exports.deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		await User.findByIdAndDelete(id);
		res.status(200).json({ message: 'User deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
