const Joi = require('joi')
/**
 * Validate the given request
 * @param {object} user - Object containing email and location to validate
 */
function validate_user(user){

    const schema = {
            email: Joi.string().min(3).email().required(),
            location: Joi.string().min(3).required()
     };

    return Joi.validate(user, schema);
}

module.exports.validate_user = validate_user;