import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowSquareOut, ShieldCheck, Trophy } from "@phosphor-icons/react";
import { Brand } from "@/components/layout/Brand";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/entrar")({
  component: LoginPage,
});

const SGA_AUTH_URL =
  import.meta.env.VITE_SGA_AUTH_URL ?? "https://santos-games.com/login";

function LoginPage() {
  return (
    <div className="min-h-screen bg-bg relative overflow-hidden flex items-center justify-center px-7 py-16">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 30% 30%, rgba(0,115,183,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 80% 80%, rgba(164,205,58,0.12) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,26,61,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,26,61,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 100% 100% at 50% 50%, black 30%, transparent 80%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white border-[1.5px] border-border-strong [box-shadow:8px_8px_0_#0A1A3D] max-w-md w-full p-9 brackets-lime"
      >
        <Link to="/" className="inline-block mb-7">
          <Brand />
        </Link>

        <div className="inline-flex items-center gap-2 bg-blue text-white px-3 py-1 font-display italic font-black text-[10px] uppercase tracking-[0.12em] [box-shadow:2px_2px_0_#A4CD3A] mb-4">
          <ShieldCheck weight="fill" size={11} />
          Auth via SGA
        </div>

        <h1 className="font-display italic font-black uppercase text-[44px] leading-[0.9] text-navy tracking-[-0.02em] mb-3">
          Entrar com
          <br />
          <span className="text-blue">Santos Games</span>
        </h1>

        <p className="text-[14px] text-fg-soft leading-relaxed mb-8">
          O Inter UnaERP usa a conta da Santos Games Arena. Você será redirecionado
          para o portal SGA e volta autenticado.
        </p>

        <div className="space-y-3 mb-8">
          <Feature
            icon={ShieldCheck}
            text="SSO seguro via HTTPS — cookie sg_auth"
          />
          <Feature
            icon={Trophy}
            text="Acesso ao painel admin se você tiver permissão"
          />
        </div>

        <a href={SGA_AUTH_URL}>
          <Button size="lg" className="w-full">
            <ArrowSquareOut weight="bold" size={14} />
            Continuar no portal SGA
          </Button>
        </a>

        <div className="mt-6 pt-5 border-t border-border text-center">
          <Link
            to="/"
            className="text-[11.5px] text-fg-mute font-extrabold uppercase tracking-[0.12em] hover:text-blue transition-colors"
          >
            ← Voltar ao início
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Feature({
  icon: Icon,
  text,
}: {
  icon: typeof ShieldCheck;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2.5 text-[12.5px] text-fg-soft">
      <Icon weight="fill" size={14} className="text-teal shrink-0" />
      {text}
    </div>
  );
}
