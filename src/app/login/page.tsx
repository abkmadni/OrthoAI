"use client";

import { useRouter } from "next/navigation";
import { setStoredRole, type UserRole } from "@/lib/role-storage";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const roles: { role: UserRole; title: string; description: string }[] = [
  {
    role: "dentist",
    title: "Dentist",
    description: "Full clinical dashboard with schedule, patients, and X-ray lab.",
  },
  {
    role: "staff",
    title: "Staff / Receptionist",
    description: "Front-desk view for booking and patient intake.",
  },
  {
    role: "admin",
    title: "Administrator",
    description: "Manage users, settings, and access all dashboards.",
  },
];

export default function LoginPage() {
  const router = useRouter();

  const handleSelect = (role: UserRole) => {
    setStoredRole(role);
    if (role === "admin") {
      router.replace("/admin");
    } else if (role === "staff") {
      router.replace("/receptionist");
    } else {
      router.replace("/dentist");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl p-8 shadow-xl border border-slate-200 bg-white/90 backdrop-blur">
        <div className="space-y-2 mb-6 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">OrthoAI Access</p>
          <h1 className="text-3xl font-semibold text-slate-900">Choose your workspace</h1>
          <p className="text-slate-500">Select a role to continue. You can switch later from the sidebar.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((r) => (
            <Card key={r.role} className="p-5 border-slate-200 hover:border-teal-500/70 transition-colors">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-slate-900">{r.title}</h2>
                <p className="text-sm text-slate-500">{r.description}</p>
                <Button className="mt-2" onClick={() => handleSelect(r.role)}>
                  Continue as {r.title}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    </main>
  );
}
