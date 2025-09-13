//app/dashboard/page.js
"use client";

export const dynamic = "force-dynamic";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p className="text-center py-5">Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <main className="container py-5 text-center">
        <h2>Please sign in to view the dashboard</h2>
      </main>
    );
  }

  return (
    <main className="container py-5">
      <div className="text-center mb-4">
        <h2>Dashboard</h2>
        <p className="text-muted">
          Welcome, {session?.user?.name} ({session?.user?.email})
        </p>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-4 mb-3">
          <Link href="/ingest" className="btn btn-outline-primary w-100">
            Ingest Customers & Orders
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link href="/campaigns" className="btn btn-outline-success w-100">
            Manage Campaigns
          </Link>
        </div>
      </div>
    </main>
  );
}







