import express from "express";

const router = express.Router();

router.post("/api/user/signout", (req, res) => {
  req.session = null;

  res.send("success fully logout");
});

export default router;
