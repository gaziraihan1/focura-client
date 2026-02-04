import { signOut } from "next-auth/react";

export async function logout() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    await fetch(`${backendUrl}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
  } catch (error) {
    console.error('⚠️ Failed to clear backend cookie:', error);
  }

  await signOut({ 
    callbackUrl: '/authentication/login',
    redirect: true 
  });
}