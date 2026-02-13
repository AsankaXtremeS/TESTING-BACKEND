export const validateRegisterUser = (data: any) => {
  if (!data.email || !data.password || !data.confirmPassword || !data.role) {
    throw new Error("Missing required fields");
  }

  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }
};

export const validateRegisterEmployer = (data: any) => {
  if (
    !data.email ||
    !data.password ||
    !data.confirmPassword ||
    !data.companyName
  ) {
    throw new Error("Missing employer fields");
  }

  if (data.password !== data.confirmPassword) {
    throw new Error("Passwords do not match");
  }
};

export const validateLogin = (data: any) => {
  if (!data.email || !data.password) {
    throw new Error("Email and password required");
  }
};
