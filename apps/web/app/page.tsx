"use client";
import React from "react";
import { useUsersQuery } from "../generated-types";

export default function HomePage() {
  const { data } = useUsersQuery();
  return (
    <div>
      Hello World
      {data?.users.map((user) => (
        <div key={user.id}>{user.username}</div>
      ))}
    </div>
  );
}
