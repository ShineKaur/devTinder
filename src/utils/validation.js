const validator = require('validator');
const bcrypt = require('bcrypt');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("Name is not valid!");
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Please enter a strong password!");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("EmailId is not valid!");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = ['age', 'gender', 'photoUrl', 'about', 'skills'];

    const isEditAllowed = Object.keys(req.body).every(field => allowedEditFields.includes(field));
    return isEditAllowed;
};

const validatePasswordForPasswordChange = async (req, user) => {
    try {
        
        const { newPassword, retypePassword } = req.body;
        if (newPassword !== retypePassword) {
            throw new Error("New password and retypePassword doesn't match.");
        }

        const isPasswordExisting = await user.validatePassword(newPassword);
        if(isPasswordExisting) {
            throw new Error("New password can't match with previous passwords.");
        }

        if (!validator.isStrongPassword(newPassword)) {
            throw new Error('Please enter a strong password!');
        }
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        return encryptedPassword;
    } catch (err) {
        throw new Error('ERROR: ' + err.message);
    }
};

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validatePasswordForPasswordChange
};