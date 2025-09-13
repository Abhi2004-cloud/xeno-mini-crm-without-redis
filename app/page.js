"use client";

export const dynamic = "force-dynamic";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center py-5">Loading...</p>;
  }

  return (
    <main className="container py-5 text-center">
      <h1 className="mb-3">Xeno Mini CRM</h1>
      <p className="mb-4 text-muted">Login with Google to continue.</p>

      {status === "authenticated" ? (
        <>
          <p className="mb-3">Signed in as {session.user?.email}</p>
          <button className="btn btn-danger mb-3" onClick={() => signOut()}>
            Sign out
          </button>
          <div>
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard →
            </Link>
          </div>
        </>
      ) : (
        <button className="btn btn-success" onClick={() => signIn("google")}>
          Sign in with Google
        </button>
      )}
    </main>
  );
}


