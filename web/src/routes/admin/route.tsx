import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { ShieldWarning, ArrowLeft } from "@phosphor-icons/react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return (
      <Guard
        title="Login necessário"
        message="Você precisa estar autenticado pelo portal SGA para acessar o painel administrativo."
        primaryAction={{ to: "/entrar", label: "Entrar com SGA" }}
      />
    );
  }

  if (!isAdmin) {
    return (
      <Guard
        title="Acesso negado"
        message="Sua conta SGA não tem permissão de administrador. Fale com o Henrique se isso é um engano."
        primaryAction={{ to: "/", label: "Voltar à Home" }}
      />
    );
  }

  return (
    <div className="min-h-screen flex bg-surface-3">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Outlet />
      </div>
    </div>
  );
}

function Guard({
  title,
  message,
  primaryAction,
}: {
  title: string;
  message: string;
  primaryAction: { to: string; label: string };
}) {
  return (
    <div className="min-h-screen bg-surface-3 flex items-center justify-center p-9">
      <div className="bg-white border-[1.5px] border-border-strong shadow-brutal-lg p-9 max-w-md w-full brackets-lime relative">
        <div className="w-14 h-14 bg-navy text-lime flex items-center justify-center mb-5">
          <ShieldWarning weight="fill" size={28} />
        </div>
        <h1 className="font-display italic font-black uppercase text-[40px] leading-[0.95] text-navy mb-3">
          {title}
        </h1>
        <p className="text-[14px] text-fg-soft leading-relaxed mb-7">
          {message}
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link to={primaryAction.to}>
              {primaryAction.to === "/" && (
                <ArrowLeft weight="bold" size={14} />
              )}
              {primaryAction.label}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
