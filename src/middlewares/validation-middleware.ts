const validationMiddleware = (req, res, next) => {
    const { error, value } = registrationSchema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
  
    // Attach the validated data to the request object for later use
    req.validatedData = value;
  
    // If validation passes, move to the next middleware or route handler
    next();
  };