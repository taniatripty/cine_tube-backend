import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

const createToken = (
  payload: JwtPayload,
  secret: string,
  { expiresIn }: SignOptions,
) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const decode = jwt.verify(token, secret) as JwtPayload;
    return {
      success: true as const,
      data: decode,
    };
  } catch (error: unknown) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Token verification failed.",
      error,
    };
  }
};

const decodeToken = (token: string) => {
  const decode = jwt.decode(token);
  return decode;
};

export const jwtutils = {
  createtoken: createToken,
  verifyToken,
  decodeToken,
};

