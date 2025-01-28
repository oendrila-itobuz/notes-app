import yup from 'yup'

export const noteSchema = yup.object({

    title: yup.string().trim()
        .min(5, 'Title must be at least 8 characters')
        .max(20, 'Title must be at most 20 characters'),
    description: yup.string().trim()
        .min(20, 'Description must be at least 20 characters')
});

export const validateNote = (schema) => async (req, res, next) => {
    try {
        await schema.validate(req.body);
        next();
    } catch (err) {
        return res.status(400).json({ errors: err.errors });
    }
};