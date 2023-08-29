require('dotenv').config()
const User = require('../models/user')
const config = require('../util/config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const emailValidator = require('email-validator')
const passwordValidator = require('password-validator')
const nodemailer = require('nodemailer')

class userController {
    async register(req, res) {
        try {
            const { email, password } = req.body;

            const schema = new passwordValidator().min(8,'Password must be minimum length 8')
            .uppercase(1, 'Password must have uppercase letter')
            .digits(3, 'Password must have at least 3 digits')

            if(!emailValidator.validate(email)){
                return res.status(400).json({ message: 'Invalid email format' })
            }
            
            if (!schema.validate(password)){
                return res.status(400).json({ message: 'Invalid password format' })
            }

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

    async reserPassword(req, res) {
        try {
            const { email, newPassword} = req.body

            const schema = new passwordValidator().min(8,'Password must be minimum length 8')
            .uppercase(1, 'Password must have uppercase letter')
            .digits(3, 'Password must have at least 3 digits')

            if (!schema.validate(newPassword)){
                return res.status(400).json({ message: 'Invalid password format' })
            }
    
            const user = await User.findOne({where: { email } })
    
            if(!user) {
                return res.status(400).json({ message: 'User not found!' })
            }
    
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            await user.update({password: hashedPassword})
    
            const transporter = nodemailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 587,
                auth: {
                    user: process.env.MAILTRAP_USER,
                    pass: process.env.MAILTRAP_PASSWORD,
                },
                secure: false
            })

            await transporter.sendMail({
                from: 'kushkiril2005@gmail.com',
                to: email,
                subject: 'Password reset!',
                text: `
                Congratulations😊, your password has been successfully changed!
                This is your new password: ${newPassword}`,
            })

            res.status(200).json({ message: 'Password reset email sent successfuly' })
        }catch (err) {
            res.status(500).json({ error: err.message})
        }
    }
}
module.exports = new userController();