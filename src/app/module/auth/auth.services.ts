import { auth } from "../../lib/auth";

type RegisterUserPayload = {
  name: string;
  email: string;
  password: string;
};

const registerUser = async (payload: RegisterUserPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  return data;
};

export const authService = {
  registerUser,
};