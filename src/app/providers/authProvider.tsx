"use client";

import { useEffect } from "react";

import { useAuthStore, useUserStore } from "@/store";

interface AuthProviderProps {
	children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
	const setUser = useUserStore((state) => state.setUser);
	const setIsUserProfileLoaded = useAuthStore(
		(state) => state.setIsUserProfileLoaded,
	);
	const setIsUserProfileLoading = useAuthStore(
		(state) => state.setIsUserProfileLoading,
	);

	useEffect(() => {
		const fetchUser = async () => {
			setIsUserProfileLoading(true);

			try {
				const response = await fetch("/api/auth/members/me", {
					credentials: "include",
				});

				if (!response.ok) {
					setUser({});
					setIsUserProfileLoaded(true);
					return;
				}

				const data = await response.json();

				setUser(data);
				setIsUserProfileLoaded(true);
			} catch (error) {
				console.error("authProvider error:", error);
				setUser({});
				setIsUserProfileLoaded(true);
			} finally {
				setIsUserProfileLoading(false);
			}
		};

		fetchUser();
	}, [setUser, setIsUserProfileLoaded, setIsUserProfileLoading]);

	return <>{children}</>;
}
