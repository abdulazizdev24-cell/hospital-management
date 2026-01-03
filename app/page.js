"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and redirect
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const user = await res.json();
          if (user.role === "admin") router.push("/dashboard/admin");
          else if (user.role === "doctor") router.push("/dashboard/doctor");
          else if (user.role === "pharmacist") router.push("/dashboard/pharmacist");
          else if (user.role === "lab_technician") router.push("/dashboard/lab-technician");
          else if (user.role === "patient") router.push("/dashboard/patient");
        }
      } catch (err) {
        // Not logged in, stay on landing page
      }
    }
    checkAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient">
      <div className="container py-16">
        <div className="text-center mb-16">
          <h1 className="mb-4">
            Hospital Management System
          </h1>
          <p className="text-gray-600 mb-8" style={{ fontSize: '1.25rem' }}>
            Streamline your hospital operations with our comprehensive management solution
          </p>
          <div className="flex-center gap-4">
            <Link href="/login" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
              Login
            </Link>
            <Link href="/register" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', fontSize: '1.125rem' }}>
              Register
            </Link>
          </div>
        </div>

        <div className="grid grid-3 gap-8 mt-16">
          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍⚕️</div>
            <h3 className="mb-2">For Doctors</h3>
            <p className="text-gray-600">
              Manage patient records, view medical history, and update patient information efficiently.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👨‍💼</div>
            <h3 className="mb-2">For Administrators</h3>
            <p className="text-gray-600">
              Full system control with patient management, user administration, and system oversight.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👤</div>
            <h3 className="mb-2">For Patients</h3>
            <p className="text-gray-600">
              Access your medical records, view your information, and stay updated with your health data.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <h2 className="mb-4">Features</h2>
          <div className="grid grid-2 gap-6 max-w-4xl" style={{ margin: '0 auto' }}>
            <div className="card text-left">
              <h4 className="mb-2">🔐 Secure Authentication</h4>
              <p className="text-gray-600">Role-based access control with secure login system</p>
            </div>
            <div className="card text-left">
              <h4 className="mb-2">📋 Patient Management</h4>
              <p className="text-gray-600">Comprehensive patient records and medical history tracking</p>
            </div>
            <div className="card text-left">
              <h4 className="mb-2">👥 User Management</h4>
              <p className="text-gray-600">Manage doctors, patients, and administrators</p>
            </div>
            <div className="card text-left">
              <h4 className="mb-2">📊 Dashboard Views</h4>
              <p className="text-gray-600">Customized dashboards for each user role</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
