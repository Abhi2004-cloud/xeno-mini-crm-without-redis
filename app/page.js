// app/page.js
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main style={{ padding: 24 }}>
      <h1>Xeno Mini CRM</h1>
      <p>Login with Google to continue.</p>

      {status === "authenticated" ? (
        <>
          <p>Signed in as {session.user?.email}</p>
          <button onClick={() => signOut()}>Sign out</button>
          <div style={{ marginTop: 16 }}>
            <Link href="/dashboard">Go to Dashboard →</Link>
          </div>
        </>
      ) : (
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      )}
    </main>
  );
}
