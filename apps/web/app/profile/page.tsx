"use client";
import React from "react";
import ProfileClient from "./client";
import { ProtectedRoute } from "@/components/protected-route";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileClient />
    </ProtectedRoute>
  );
}
