import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      profile: {
        firstName: string,
        lastName: string,
      };
      phone: string;
      isVerfied: boolean;
    };
    accessToken?: string;
    error?: string;
  }

  interface User {
    id: string;
    email: string;
    username: string;
    isVerfied: boolean;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string;
    isVerfied: boolean;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
