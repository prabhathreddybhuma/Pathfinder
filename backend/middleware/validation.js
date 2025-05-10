import Joi from 'joi';

export const validateRegistration = (req, res, next) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};

export const validateEducation = (req, res, next) => {
  const schema = Joi.object({
    degree: Joi.string().required(),
    field: Joi.string().required(),
    graduationYear: Joi.number().min(1900).max(2100).required(),
    institution: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
};
