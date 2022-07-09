const validationFunctions = {
    name: ({teamName}) => teamNameValidation(teamName),
    count: ({membersCount}) => membersCountValidation(membersCount)
}

module.exports = (data) => {
    let result = {
        isValid: true,
        fields: {},
        failed: []
    }

    Object.keys(validationFunctions).forEach(val => {
        const validationFunction = validationFunctions[val];
        result.fields[val] = validationFunction(data);
    });

    Object.values(result.fields).forEach(val => {
        if (!val) {
            result.isValid = false;
        }
    })

    return result;
}

const teamNameValidation = (teamName) => {
    if (typeof teamName === typeof '' && teamName.length > 0) {
        return true;
    } else {
        return false;
    }
}

const membersCountValidation = (membersCount) => {
    if (typeof membersCount === typeof 1 && membersCount > 0) {
        return true;
    } else {
        return false;
    }
}