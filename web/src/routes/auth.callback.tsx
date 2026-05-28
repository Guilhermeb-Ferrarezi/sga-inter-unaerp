import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle } from "@phosphor-icons/react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallbackPage,
});

/**
 * Página de retorno do fluxo OAuth-like do auth.santos-games.com.
 *
 * O auth-api seta o cookie sga_auth no domínio .santos-games.com antes
 * de redirecionar pra cá. Aqui só precisamos:
 *   1. Aguardar o AuthProvider detectar o cookie (próximo render)
 *   2. Redirecionar pra home (ou rota original se passada via "next" param)
 */
function AuthCallbackPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const t = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const next = params.get("next") || "/";
      navigate({ to: next as never, replace: true });
    }, 600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-7 py-16 bg-bg">
      <div className="text-center">
        <div className="w-16 h-16 bg-lime text-navy flex items-center justify-center mx-auto mb-6 [box-shadow:4px_4px_0_#0A1A3D]">
          <CheckCircle weight="fill" size={32} />
        </div>
        <h1 className="font-display italic font-black uppercase text-[48px] leading-[0.95] text-navy tracking-[-0.025em] mb-3">
          Autenticado
        </h1>
        <p className="text-[14px] text-fg-soft">
          {user
            ? `Bem-vindo, ${user.login}. Redirecionando…`
            : "Validando sessão…"}
        </p>
      </div>
    </div>
  );
}
