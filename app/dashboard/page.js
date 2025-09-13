"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <main style={{ padding: 24 }}>
      <h2>Dashboard</h2>
      <p>Welcome, {session?.user?.name} ({session?.user?.email})</p>

      <ul style={{ marginTop: 12, lineHeight: 2 }}>
        <li><Link href="/ingest">Ingest Customers & Orders</Link></li>
        <li><Link href="/campaigns">Campaigns</Link></li>
      </ul>
    </main>
  );
}
