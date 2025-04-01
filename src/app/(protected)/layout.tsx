"use client";

import AuthProvider from "@/app/providers/authProvider";
import Providers from "@/app/providers/providers";

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
