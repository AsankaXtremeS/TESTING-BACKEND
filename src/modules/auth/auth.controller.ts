import { Request, Response } from "express";
import { authService } from "./auth.service";
import {
  validateRegisterUser,
  validateRegisterEmployer,
  validateLogin,
} from "./auth.validation";


// REGISTER STUDENT / PROFESSIONAL

export const registerUser = async (req: Request, res: Response) => {
  try {
    validateRegisterUser(req.body);

    const result = await authService.registerUser(req.body);

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// REGISTER EMPLOYER (WITH PDF UPLOAD)


export const registerEmployer = async (req: Request, res: Response) => {
  try {
    const file = req.file;

    if (!file) {
      throw new Error("Business registration PDF is required");
    }

    validateRegisterEmployer(req.body);

    const result = await authService.registerEmployer({
      ...req.body,
      registrationFileUrl: file.path,
      registrationFileName: file.filename,
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// LOGIN


export const login = async (req: Request, res: Response) => {
  try {
    validateLogin(req.body);

    const result = await authService.login(req.body);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// REFRESH TOKEN


export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new Error("Refresh token required");
    }

    const result = await authService.refresh(refreshToken);

    res.json(result);
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};


// LOGOUT


export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new Error("Refresh token required");
    }

    const result = await authService.logout(refreshToken);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// FORGOT PASSWORD


export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Email required");
    }

    const result = await authService.forgotPassword(email);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// RESET PASSWORD


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      throw new Error("Token and new password required");
    }

    const result = await authService.resetPassword(token, newPassword);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};


// ADMIN APPROVE EMPLOYER


export const approveEmployer = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      throw new Error("User ID required");
    }

    const result = await authService.approveEmployer(userId);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
