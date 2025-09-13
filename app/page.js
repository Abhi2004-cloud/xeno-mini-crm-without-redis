"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="container py-5">
      {/* Hero Section */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Welcome to Xeno Mini CRM</h1>
        <p className="lead text-muted mb-4">
          Manage your customers, create personalized campaigns, and leverage AI
          for smarter insights.
        </p>

        {status === "authenticated" ? (
          <>
            <p className="mb-3">
              Signed in as <strong>{session.user?.email}</strong>
            </p>
            <button
              className="btn btn-outline-danger me-2"
              onClick={() => signOut()}
            >
              Sign out
            </button>
            <Link href="/dashboard" className="btn btn-primary">
              Go to Dashboard →
            </Link>
          </>
        ) : (
          <button
            className="btn btn-success btn-lg"
            onClick={() => signIn("google")}
          >
            Sign in with Google
          </button>
        )}
      </div>

      {/* Features Section */}
      <div className="row text-center">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Customer Ingestion</h5>
              <p className="card-text">
                Easily add and manage customer data for segmentation and
                targeting.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Campaign Builder</h5>
              <p className="card-text">
                Create campaigns with dynamic rules, AI message suggestions, and
                insights.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">AI-Powered Insights</h5>
              <p className="card-text">
                Leverage AI for personalized messages, summaries, and smarter
                campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
