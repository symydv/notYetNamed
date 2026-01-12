import { ApiError } from "../utils/ApiError.js";

export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err.errors || []
  });
};

//this function is used to provide structured errors to frontend without it express by default sends error as HTML element.
//we used this at end off app.js (app.use(errorHandler))