import express from "express";
import jwt from "jsonwebtoken";
import { currentUser, requireAuth } from "@ticketwithspread/common";
const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
  res.status(200).send({ currentuser: req.currentUser || null });
});

export default router;
