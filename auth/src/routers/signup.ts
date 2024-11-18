import express, { Request, Response } from "express";
import { body, validationResult, ValidationError } from "express-validator";
import {
  RequestValidationError,
  BadRequestError,
  validationRequest,
} from "@ticketwithspread/common";
import { User } from "../model/user";
import "express-async-errors";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("email must be valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 to 20 characters"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Email in use");
      throw new BadRequestError("email already exists");
    }
    const haspass = await bcrypt.hash(password, 10);
    const user = User.build({ email, password: haspass });
    await user.save();
    // generate jwt
    const userJwt = Jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_KEY!
    );
    req.session = { jwt: userJwt };
    res.status(201).send(user);
  }
);

export default router;
