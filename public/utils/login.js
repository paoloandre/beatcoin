const validator = require("validator");
const isEmpty = require("lodash/isEmpty");

module.exports.validateInput = function(data) {
  let errors = {};

  if (!data.username) {
    errors.username = "this field is required";
  }

  if (!data.password) {
    errors.password = "this field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors) //if error is empty than isValid = true
  };
};
