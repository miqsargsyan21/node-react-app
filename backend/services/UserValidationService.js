const validationFunctions = {
    email: ({email}) => emailValidation(email),
    password: ({password, secondPassword}) => passwordValidation(password, secondPassword),
    username: ({username}) => usernameValidation(username),
    firstName: ({firstName}) => nameValidation(firstName),
    lastName: ({lastName}) => nameValidation(lastName)
}

module.exports = (data, type) => {
    const result = {
        isValid: true,
        fields: {},
        failed: []
    };

    const requiredFields = type === 'register' ? Object.keys(validationFunctions) :  ['username', 'password']

    requiredFields.forEach(val => {
        const validationFunction = validationFunctions[val];
        result.fields[val] = validationFunction(data);

        if (!result.fields[val].isValid) {
            result.fields[val].message = 'Required field';
        }
    })

    Object.values(result.fields).forEach(val => {
        if (!val.isValid) {
            result.isValid = false;
        }
        if (val.message) {
            result.failed[result.failed.length] = Object.keys(result.fields).find(key => result.fields[key] === val);
        }
    })

    return result;
}

const emailValidation = (email) => {
    let sample = /\S+@\S+\.\S+/;

    return {
        isValid: sample.test(email),
        message: ''
    };
};

const passwordValidation = (password, confirmPassword) => {
    let sample = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;

    let isValid;

    if (confirmPassword) {
        isValid = sample.test(password) && password === confirmPassword;
    } else {
        isValid = sample.test(password);
    }

    return {
        isValid: isValid,
        message: ''
    };
};

const usernameValidation = (username) => {
    let sample = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,20}$/;

    return {
        isValid: sample.test(username),
        message: ''
    };
};

const nameValidation = (name) => {
    return {
        isValid: name.length >= 1,
        message: ''
    }
}

