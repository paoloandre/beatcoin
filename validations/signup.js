const validator = require("validator");
const isEmpty = require("lodash/isEmpty");

module.exports.validateInput = function(data) {
  let errors = {};

  if (!data.email) {
    errors.email = "this field is required";
  } else {
    if (!validator.isEmail(data.email)) {
      errors.email = "email is invalid";
    }
  }
  if (!data.name) {
    errors.name = "this field is required";
  }

  if (!data.username) {
    errors.username = "this field is required";
  }

  if (!data.password) {
    errors.password = "this field is required";
  }

  if (!data.passwordConfirmation) {
    errors.passwordConfirmation = "this field is required";
  }

  if (!validator.equals(data.password, data.passwordConfirmation)) {
    errors.passwordConfirmation = "Passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors) //if error is empty than isValid = true
  };
};
