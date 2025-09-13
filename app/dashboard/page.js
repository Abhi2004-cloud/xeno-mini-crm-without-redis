//app/dashboard/page.js
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

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

