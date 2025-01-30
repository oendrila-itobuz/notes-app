import yup from 'yup'

export const userSchema = yup.object({

    userName: yup.string().trim()
        .min(5, 'userName must be at least 8 characters')
        .max(20, 'userName must be at most 20 characters'),
    email: yup.string()
        .email('The email is not a valid one').required(),
    password: yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Must include at least one uppercase letter')
        .matches(/[a-z]/, 'Must include at least one lowercase letter')
        .matches(/\d/, 'Must include at least one number')
        .matches(/\W/, 'Must include at least one special character')
});

export const validateUser = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body);
        next();
    } catch (err) {
        return res.status(400).json({ errors: err.errors });
    }
};