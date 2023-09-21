const User = require('../../models/user');

module.exports = async function checkBan(req, res, next) {
    const userId = req.userData.userId;
    const user = await User.findByPk(userId);

    if (user.status === true) {
        return res.status(403).json({ message: 'Ви заблоковані і не можете створювати тудушки.' });
    }

    next();
};
