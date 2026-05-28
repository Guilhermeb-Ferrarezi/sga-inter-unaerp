import { createRootRoute, Outlet, useRouterState, Link } from "@tanstack/react-router";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ApiStatusBanner } from "@/components/layout/ApiStatusBanner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MagnifyingGlass } from "@phosphor-icons/react";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFoundPage,
});

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ApiStatusBanner />
      <Nav />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function NotFoundPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <div className="min-h-screen bg-surface-3 flex items-center justify-center p-9">
        <NotFoundContent admin />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Nav />
      <main className="flex-1 flex items-center justify-center px-7 py-20">
        <NotFoundContent />
      </main>
      <Footer />
    </div>
  );
}

function NotFoundContent({ admin = false }: { admin?: boolean }) {
  return (
    <div className="max-w-2xl w-full text-center">
      <div
        className="font-display italic font-black uppercase text-[200px] leading-none text-navy/[0.08] tracking-[-0.03em] pointer-events-none select-none -mb-24"
      >
        404
      </div>
      <h1 className="font-display italic font-black uppercase text-[80px] leading-[0.85] text-navy tracking-[-0.025em] mb-6">
        Página
        <br />
        <span className="text-blue">não encontrada</span>
      </h1>
      <p className="text-[15px] text-fg-soft leading-relaxed max-w-lg mx-auto mb-9">
        A página que você procura não existe ou foi movida. Talvez tenha sido
        registrada em uma edição anterior, ou o link esteja desatualizado.
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild>
          <Link to={admin ? "/admin" : "/"}>
            <ArrowLeft weight="bold" size={14} />
            {admin ? "Dashboard" : "Voltar à Home"}
          </Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/confrontos">
            <MagnifyingGlass weight="bold" size={14} />
            Ver Confrontos
          </Link>
        </Button>
      </div>
    </div>
  );
}
