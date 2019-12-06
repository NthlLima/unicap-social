const { Student } = require('../models/student.model');

const register = async(profile) => {
    const {
        academic: { matriculation },
        personal: { name },
        contact: { email }
    } = profile;

    const [ mat, digit ] = matriculation.split('-');

    try {
        const student = await Student.create({
            name,
            email,
            matriculation: mat,
            digit
        });

        return student;
        
    } catch (err) {
        throw new Error(err.message);
    }
}

const login = async(profile) => {
    const { academic: { matriculation } } = profile;
    const [ mat, digit ] = matriculation.split('-');
    const student = await Student.findOne({ matriculation: mat, digit });

    if(!student) {
        return await register(profile);
    }

    return student;
}

const chats = async() => {

}

module.exports = {
    login,
    register,
    chats
}