require('dotenv').config()
const User = require('../models/user')
const config = require('../util/config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

class userController {
    async register(req, res, next) {
        try {
            const { email, password, confirmPassword } = req.body;

            if(!config.emailValidate(email)) {
                throw new Error('Invalid email format');
            }
            
            if(!config.passwordValidate(password)) {
                throw new Error('Invalid password format');
            }
            
            if (confirmPassword != password) {
                throw new Error('Password does not match')
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            if (typeof email !== 'string' || typeof password !== 'string' || typeof confirmPassword !== 'string') {
                throw new Error('Invalid input data')
            }

            const user = await User.create({
                email: email,
                password: hashedPassword
            });

            const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' })

            res.status(201).json({ message: 'User registered successfully', token: token });
        }
        catch (err) {
            next(err)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            if (typeof email !== 'string' || typeof password !== 'string') {
                throw new Error('Invalid input data')
            }

            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new Error('User not found');
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                throw new Error('Invalid credentials');
            }

            const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });

            res.json({ message: 'User logged in successfully', token: token });
        } catch (err) {
            next(err)
        }
    }

    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body

            if (typeof email !== 'string') {
                throw new Error('Invalid input data')
            }

            const user = await User.findOne({ where: { email } })

            if (!user) {
                throw new Error('User not found!')
            }

            const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' })

            const transporter = nodemailer.createTransport({
                host: 'smtp.mailtrap.io',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.MAILTRAP_USER,
                    pass: process.env.MAILTRAP_PASSWORD
                },
            })

            await transporter.sendMail({
                from: 'kushkiril2005@gmail.com',
                to: email,
                subject: 'Password reset token',
                text: `Your token to password reset: \n ${token}`
            })

            res.status(200).json({ message: 'Password reset token sent successfuly' })
        } catch (err) {
            next(err)
        }
    }

    async reserPassword(req, res, next) {
        try {
            const { newPassword, confirmNewPassword } = req.body

            if (!config.passwordValidate(newPassword)) {
                throw new Error('Invalid password format')
            }

            if (confirmNewPassword != newPassword) {
                throw new Error('Password does not match')
            }

            const token = req.headers.authorization.split(' ')[1];

            const decodedToken = jwt.verify(token, config.jwtSecret);
    
            const userId = decodedToken.userId;
    
            const user = await User.findByPk(userId);
    
            if (!user) {
                throw new Error('User not found!');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10)

            if (typeof newPassword !== 'string' || typeof confirmNewPassword !== 'string') {
                throw new Error('Invalid input data')
            }

            await user.update({ password: hashedPassword })

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
                to: user.email,
                subject: 'Password reset!',
                text: `
                Congratulations! Your password has been successfully changed!
                This is your new password: ${newPassword}`,
            })

            res.status(200).json({ message: 'Password reset email sent successfuly' })
        } catch (err) {
            next(err)
        }
    }
}
module.exports = new userController();