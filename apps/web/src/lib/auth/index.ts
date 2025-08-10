import { createAuthClient } from "better-auth/react";

const { signUp, signIn, signOut, useSession } = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
});

export { signIn, signOut, signUp, useSession };
