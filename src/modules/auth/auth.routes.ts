import { Router } from "express";
import {
  registerUser,
  registerEmployer,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword,
  approveEmployer,
} from "./auth.controller";
import { upload } from "../../middlewares/upload.middleware";

const router = Router();

router.post("/register", registerUser);
router.post(
  "/register-employer",
  upload.single("registrationFile"),
  registerEmployer
);

router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/approve-employer", approveEmployer);

export default router;
