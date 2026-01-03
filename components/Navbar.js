"use client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user info from cookie (client-side)
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "doctor") return "/dashboard/doctor";
    if (user.role === "pharmacist") return "/dashboard/pharmacist";
    if (user.role === "lab_technician") return "/dashboard/lab-technician";
    return "/dashboard/patient";
  };

  // Don't show navbar on login/register pages
  if (pathname === "/login" || pathname === "/register") {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="flex">
          <Link
            href={user ? getDashboardPath() : "/"}
            className="navbar-brand"
          >
            Hospital Management System
          </Link>
        </div>
        <div className="navbar-user">
          {loading ? (
            <span className="text-gray-600">Loading...</span>
          ) : user ? (
            <>
              <span className="text-gray-700 hidden-md">
                Welcome, <strong>{user.name}</strong> (
                <span className="capitalize">{user.role}</span>)
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ padding: '0.5rem 1rem' }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

