// app/api/auth/logout/route.js
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(process.env.COOKIE_NAME);

    return new Response(
      JSON.stringify({ message: "Logout successful" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(
      JSON.stringify({ message: "Something went wrong" }),
      { status: 500 }
    );
  }
}

