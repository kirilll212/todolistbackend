const User = require('../models/user')
const config = require('../util/config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class userController {
    async register(req, res) {
        try {
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                email: email,
                password: hashedPassword
            });

            const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' })

            res.status(201).json({ message: 'User registered successfully', token: token });
        }
        catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });

            res.json({ message: 'User logged in successfully', token: token });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
module.exports = new userController();