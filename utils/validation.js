const  isEmpty = (value)=> {
    return !value || value.trim() === '';
}

const  userCredentialsAreValid = (email, password)=> {
    return (
        email && email.includes('@') && password && password.trim().length >= 8
    );
}

const  userDetailsAreValid = (email, password, name, street, postal, city) => {
    return (
        userCredentialsAreValid(email, password) &&
        !isEmpty(name) &&
        !isEmpty(street) &&
        !isEmpty(postal) &&
        !isEmpty(city)
    );
}

const passwordIsConfirmed = (password, confirmPassword)=> {
    return password === confirmPassword;
}

module.exports = {
    userDetailsAreValid: userDetailsAreValid,
    passwordIsConfirmed: passwordIsConfirmed,
};