import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const optionalAuth = async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    req.user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = {_id: decoded._id};
  } catch (err) {
    req.user = null;
  }

  next();
};

//this file is created so that we can use req.user in files like get video by id where we dont need to verify user but still need users inforation.