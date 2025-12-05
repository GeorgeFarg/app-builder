"use client";

import React from "react";
import Authguard from "@/Gaurds/Authguard";
import { useAuthStore } from "@/store/auth-store";

export default function Layout({ children }: { children: React.ReactNode }) {
    const token = useAuthStore(state => state.accessToken);
    console.log("Token:", token);
    return <Authguard>{children}</Authguard>;
}
