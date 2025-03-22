"use client";

import { useEffect } from "react";

import { useUserStore } from "@/store";

interface AuthProviderProps {
	children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
	const setUser = useUserStore((state) => state.setUser);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await fetch("/api/auth/members/me");

				if (!response.ok) {
					setUser({});
					return;
				}

				const data = await response.json();

				setUser(data);
			} catch (error) {
				console.error("authProvider error:", error);
				setUser({});
			}
		};

		fetchUser();
	}, [setUser]);

	return <>{children}</>;
}
