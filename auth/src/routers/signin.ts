import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  RequestValidationError,
  validationRequest,
} from "@ticketwithspread/common";
import "express-async-errors";
import bcrypt from "bcrypt";
import { User } from "../model/user";
import { NotFoundError, BadRequestError } from "@ticketwithspread/common";
import Jwt from "jsonwebtoken";
const router = express.Router();

router.post(
  "/api/user/signin",
  [
    body("email").isEmail().withMessage("email must be a valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("password must be between 4 to 20 characters"),
  ],
  validationRequest,
  async (req: Request, res: Response) => {
    const error = validationResult(req);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }
    const { email, password } = req.body;
    const userexist = await User.findOne({ email });
    if (!userexist) {
      throw new NotFoundError();
    }
    const match = await bcrypt.compare(password, userexist.password);
    if (!match) {
      throw new BadRequestError("password didnt match");
    }
    // generate jwt
    const userJwt = Jwt.sign(
      { id: userexist.id, email: userexist.email },
      process.env.JWT_KEY!
    );

    req.session = { jwt: userJwt };
    res.status(200).send(userexist);
  }
);

export default router;
