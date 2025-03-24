"use client";

import AuthProvider from "@/app/authProvider";
import Providers from "@/app/providers";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Providers>
			<AuthProvider>{children}</AuthProvider>
		</Providers>
	);
}
