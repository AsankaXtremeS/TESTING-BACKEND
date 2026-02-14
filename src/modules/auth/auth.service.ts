import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { authRepository } from "./auth.repository";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;

const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = async (userId: string) => {
  const token = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

  await authRepository.createRefreshToken({
    token,
    userId,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return token;
};

export const authService = {
  async registerUser(data: any) {
    const existing = await authRepository.findUserByEmail(data.email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await authRepository.createUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashed,
      role: data.role,
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  },

  async registerEmployer(data: any) {
    const existing = await authRepository.findUserByEmail(data.email);
    if (existing) throw new Error("User already exists");

    const hashed = await bcrypt.hash(data.password, 10);

    const user = await authRepository.createUser({
      email: data.email,
      password: hashed,
      role: "EMPLOYER",
    });

    await authRepository.createEmployerProfile({
      userId: user.id,
      companyName: data.companyName,
      registrationFileUrl: data.registrationFileUrl,
      registrationFileName: data.registrationFileName,
    });

    return {
      message: "Registration successful. Await admin approval.",
    };
  },

  async login(data: any) {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user || !user.password) throw new Error("Invalid credentials");

    const match = await bcrypt.compare(data.password, user.password);
    if (!match) throw new Error("Invalid credentials");

    if (user.role === "EMPLOYER") {
      if (
        !user.employerProfile ||
        user.employerProfile.verificationStatus !== "APPROVED"
      ) {
        throw new Error("Account pending admin approval");
      }
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = await generateRefreshToken(user.id);

    return { accessToken, refreshToken };
  },

  async refresh(token: string) {
    const stored = await authRepository.findRefreshToken(token);
    if (!stored || stored.isRevoked) {
      throw new Error("Invalid refresh token");
    }

    const payload = jwt.verify(token, JWT_REFRESH_SECRET) as any;
    return {
      accessToken: generateAccessToken(payload.userId, "USER"),
    };
  },

  async logout(token: string) {
    await authRepository.revokeRefreshToken(token);
    return { message: "Logged out successfully" };
  },

  async forgotPassword(email: string) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) return { message: "If email exists, reset link sent" };

    const resetToken = crypto.randomBytes(32).toString("hex");

    await authRepository.createPasswordResetToken({
      token: resetToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    console.log("Reset token:", resetToken);

    return { message: "If email exists, reset link sent" };
  },

  async resetPassword(token: string, newPassword: string) {
    const stored = await authRepository.findPasswordResetToken(token);
    if (!stored || stored.expiresAt < new Date()) {
      throw new Error("Invalid or expired token");
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await authRepository.createUser;

    await authRepository.deletePasswordResetToken(token);

    return { message: "Password reset successful" };
  },

  async approveEmployer(userId: string) {
    await authRepository.approveEmployer(userId);
    return { message: "Employer approved successfully" };
  },
};