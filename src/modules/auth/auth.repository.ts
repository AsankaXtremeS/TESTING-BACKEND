import { prisma } from "../../config/db";

export const authRepository = {
  findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { employerProfile: true },
    });
  },

  createUser(data: any) {
    return prisma.user.create({ data });
  },

  createEmployerProfile(data: any) {
    return prisma.employerProfile.create({ data });
  },

  createRefreshToken(data: any) {
    return prisma.refreshToken.create({ data });
  },

  findRefreshToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  },

  revokeRefreshToken(token: string) {
    return prisma.refreshToken.update({
      where: { token },
      data: { isRevoked: true },
    });
  },

  approveEmployer(userId: string) {
    return prisma.employerProfile.update({
      where: { userId },
      data: { verificationStatus: "APPROVED" },
    });
  },

  createPasswordResetToken(data: any) {
    return prisma.passwordResetToken.create({ data });
  },

  findPasswordResetToken(token: string) {
    return prisma.passwordResetToken.findUnique({ where: { token } });
  },

  deletePasswordResetToken(token: string) {
    return prisma.passwordResetToken.delete({ where: { token } });
  },
};
