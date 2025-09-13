"use client";

export const dynamic = "force-dynamic";

import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5 mb-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3">Xeno Mini CRM</h1>
          <p className="lead mb-4">
            Powerful customer relationship management with AI-powered campaigns
          </p>
          <p className="mb-4">
            Manage customers, create targeted campaigns, and track delivery with intelligent automation
          </p>
          
          {status === "authenticated" ? (
            <div>
              <p className="mb-3">Welcome back, {session.user?.name || session.user?.email}!</p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <Link href="/dashboard" className="btn btn-light btn-lg">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Go to Dashboard
                </Link>
                <Link href="/campaigns" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-megaphone me-2"></i>
                  Manage Campaigns
                </Link>
                <button className="btn btn-outline-light" onClick={() => signOut()}>
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <button className="btn btn-light btn-lg px-4" onClick={() => signIn("google")}>
              <i className="bi bi-google me-2"></i>
              Sign in with Google
            </button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <div className="row text-center mb-5">
          <div className="col-12">
            <h2 className="display-6 fw-bold mb-3">Key Features</h2>
            <p className="lead text-muted">Everything you need to manage customer relationships effectively</p>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}>
                  <i className="bi bi-people-fill text-primary fs-3"></i>
                </div>
                <h5 className="card-title fw-bold">Customer Management</h5>
                <p className="card-text text-muted">
                  Import and manage customer data with detailed profiles including spend tracking, visit history, and engagement metrics.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}>
                  <i className="bi bi-megaphone-fill text-success fs-3"></i>
                </div>
                <h5 className="card-title fw-bold">Smart Campaigns</h5>
                <p className="card-text text-muted">
                  Create targeted marketing campaigns with advanced audience segmentation based on customer behavior and preferences.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="bg-warning bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}>
                  <i className="bi bi-robot text-warning fs-3"></i>
                </div>
                <h5 className="card-title fw-bold">AI-Powered Messages</h5>
                <p className="card-text text-muted">
                  Generate personalized message templates using AI based on your campaign objectives and target audience.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="bg-info bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}>
                  <i className="bi bi-graph-up text-info fs-3"></i>
                </div>
                <h5 className="card-title fw-bold">Real-time Analytics</h5>
                <p className="card-text text-muted">
                  Track campaign performance with detailed delivery logs, success rates, and engagement analytics.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="bg-danger bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}>
                  <i className="bi bi-funnel-fill text-danger fs-3"></i>
                </div>
                <h5 className="card-title fw-bold">Advanced Filtering</h5>
                <p className="card-text text-muted">
                  Create complex audience segments using multiple criteria like spend amount, visit frequency, and activity patterns.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-body text-center p-4">
                <div className="bg-secondary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: "64px", height: "64px" }}>
                  <i className="bi bi-cloud-upload text-secondary fs-3"></i>
                </div>
                <h5 className="card-title fw-bold">Easy Data Import</h5>
                <p className="card-text text-muted">
                  Seamlessly import customer and order data to get started quickly with your existing customer base.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {status !== "authenticated" && (
        <div className="bg-light py-5 mt-5">
          <div className="container text-center">
            <h3 className="fw-bold mb-3">Ready to get started?</h3>
            <p className="lead text-muted mb-4">
              Sign in with your Google account to start managing your customer relationships
            </p>
            <button className="btn btn-primary btn-lg px-4" onClick={() => signIn("google")}>
              <i className="bi bi-google me-2"></i>
              Get Started Now
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container text-center">
          <p className="mb-0">&copy; 2024 Xeno Mini CRM. Built with Next.js and Bootstrap.</p>
        </div>
      </footer>
    </>
  );
}


