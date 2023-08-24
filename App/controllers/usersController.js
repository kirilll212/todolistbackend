const User = require('../models/user')
const bcrypt = require('bcryptjs')

class userController {
    async register(req, res){
        try {
            const { email, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10);
    
            await User.create({
                email: email,
                password: hashedPassword
            });
    
            res.status(201).json({ message: 'User registered successfully' });
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
            res.json({ message: 'User logged in successfully' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
module.exports = new userController();