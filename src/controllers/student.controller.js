const { Student } = require('../models/student.model');

const store = async(profile) => {
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
    const student = await Student.findOne({ matriculation: mat, digit }).lean();

    if(!student) {
        return await store(profile);
    }

    return student;
}

module.exports = {
    login,
    store
}