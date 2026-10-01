import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminEditor } from "@/components/AdminEditor";
import { isAdminConfigured, verifyAdminSessionToken } from "@/lib/admin-auth";

export const metadata = { title: "Admin | EarnPouch", robots: { index: false, follow: false } };

export default async function AdminPage() {
	const storageMode = process.env.GITHUB_CONTENT_TOKEN && process.env.GITHUB_REPOSITORY ? "GitHub" : "Local filesystem";

	if (!isAdminConfigured()) {
		return (
			<main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#0b1120] px-5 py-10 text-slate-100">
				<div className="max-w-lg rounded-2xl border border-amber-700 bg-[#111827] p-8 text-center">
					<p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Configuration needed</p>
					<h1 className="mt-3 text-2xl font-bold">Admin auth is not configured</h1>
					<p className="mt-3 text-sm leading-6 text-slate-300">
						Set ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET in Vercel Environment Variables before enabling the admin dashboard.
					</p>
				</div>
			</main>
		);
	}

	const sessionCookie = (await cookies()).get("earnpouch_admin_session")?.value ?? "";
	if (!verifyAdminSessionToken(sessionCookie)) {
		redirect("/admin/login");
	}

	return <AdminEditor storageMode={storageMode} />;
}
