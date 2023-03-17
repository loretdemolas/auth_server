import Joi from "joi";

export const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string()
        .required(),

        email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: {
            allow: ["com", "net"] } }),

        password: Joi.string()
        .required(),
    });
    
    const validation = schema.validate(data)
    return validation
};


export const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string()
        .required()
        .email({ minDomainSegments: 2, tlds: {
            allow: ["com", "net"] } }),
        
            password: Joi.string()
        .required(),
    });
    const validation = schema.validate(data)
    return validation
};

