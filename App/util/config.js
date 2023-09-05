const emailValidate = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

const passwordValidate = (password) => {
    if (password.length < 8) {
        return false;
    }
    
    if (!/[A-Z]/.test(password)) {
        return false;
    }
    
    if ((password.match(/[0-9]/g) || []).length < 3) {
        return false;
    }
    
    return true;
}

module.exports = {
    jwtSecret: '72b1dea607843ac81d0f2e54265c6c64b4dc113898158e73bcdf4079416970805b1d5c8921783337936d271157b00b0b077be18c4eebbf737853c694dd541243',
    emailValidate,
    passwordValidate
}