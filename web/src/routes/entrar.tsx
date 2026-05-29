import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { redirectToSgaAuth } from "@/lib/sga-auth";

export const Route = createFileRoute("/entrar")({
  component: LoginRedirect,
});

function LoginRedirect() {
  useEffect(() => {
    redirectToSgaAuth();
  }, []);

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-fg-mute font-display italic font-extrabold uppercase tracking-[0.1em]">
        Redirecionando para o portal SGA…
      </div>
    </div>
  );
}
