import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Trophy, Calendar } from "@phosphor-icons/react";
import { LiveDot } from "@/components/ui/live-dot";
import { Button } from "@/components/ui/button";
import { teams } from "@/data/mock";

const stats = [
  { num: "9", label: "Times", color: "text-blue" },
  { num: "47", label: "Jogadores", color: "text-teal" },
  { num: "12", small: "/24", label: "Partidas", color: "text-lime" },
];

export function Hero() {
  const leader = teams[0];

  return (
    <section className="relative overflow-hidden bg-bg border-b border-border">
      {/* gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 90% 30%, rgba(46,170,128,0.16) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 95% 80%, rgba(164,205,58,0.14) 0%, transparent 60%), radial-gradient(ellipse 80% 80% at 10% 50%, rgba(0,115,183,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(10,26,61,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(10,26,61,0.04) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          WebkitMaskImage:
            "radial-gradient(ellipse 100% 100% at 0% 50%, black 30%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 100% 100% at 0% 50%, black 30%, transparent 80%)",
        }}
      />

      <div className="relative max-w-[1500px] mx-auto px-7 py-[72px] grid lg:grid-cols-[1.2fr_1fr] gap-14 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2.5 bg-blue text-white px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.12em] shadow-brutal-sm mb-5.5"
          >
            <LiveDot variant="lime" />
            Edição em Andamento · Fase de Grupos
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="font-display italic font-black uppercase text-[78px] md:text-[104px] leading-[0.86] tracking-[-0.025em] text-navy mb-5"
          >
            <span className="text-blue">In</span>
            <span className="text-teal">te</span>
            <span className="text-lime">r</span>
            <br />
            UnaERP
            <br />
            <span
              className="text-transparent text-[60px] md:text-[80px] inline-block"
              style={{ WebkitTextStroke: "2px #A4CD3A" }}
            >
              2025
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="text-[16px] text-fg-soft leading-[1.6] max-w-[540px] mb-8"
          >
            O campeonato universitário oficial da UnaERP em parceria com a{" "}
            <strong className="text-navy font-bold">Santos Games Arena</strong>.
            Cada partida, cada jogador, cada highlight registrado.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex gap-3 mb-10"
          >
            <Button variant="primary" size="lg" asChild>
              <Link to="/confrontos">
                Ver Confrontos
                <ArrowRight weight="bold" size={14} />
              </Link>
            </Button>
            <Button variant="ghost" size="lg" asChild>
              <Link to="/classificacao">Classificação</Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="grid grid-cols-3 max-w-[540px] border-t border-b border-border-strong py-4.5"
          >
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-5.5 ${i < 2 ? "border-r border-border" : ""}`}
              >
                <div
                  className={`font-display italic font-black text-[46px] leading-none text-navy ${s.color} tabular-nums`}
                >
                  {s.num}
                  {s.small && (
                    <span className="text-[22px] text-fg-mute">{s.small}</span>
                  )}
                </div>
                <div className="text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-1.5">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Hero side card */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative bg-white border-[1.5px] border-border-strong overflow-hidden aspect-[4/5] [box-shadow:8px_8px_0_#0A1A3D]"
        >
          {/* corners */}
          <span className="absolute top-2.5 left-2.5 w-9 h-9 border-t-[3px] border-l-[3px] border-lime z-10" />
          <span className="absolute bottom-2.5 right-2.5 w-9 h-9 border-b-[3px] border-r-[3px] border-lime z-10" />
          {/* bg */}
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, white 100%), linear-gradient(135deg, rgba(0,115,183,0.85), rgba(46,170,128,0.85))",
            }}
          />
          <div className="relative h-full p-8 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2.5 text-teal font-display italic font-black text-[10.5px] uppercase tracking-[0.12em]">
                <LiveDot variant="teal" />
                Torneio Ativo · Premiação
              </div>
              <h3 className="font-display italic font-black uppercase text-[42px] leading-[0.95] text-navy mt-6 mb-8">
                Inter UnaERP <span className="text-blue">2025</span> · Valorant
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-5.5 pt-5.5 border-t-2 border-border-strong">
              <div>
                <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                  Líder do Ranking
                </div>
                <div className="font-display italic font-black text-[26px] text-blue leading-none mt-1">
                  {leader.name}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                  Premiação Total
                </div>
                <div className="font-display italic font-black text-[26px] text-lime leading-none mt-1 flex items-center gap-1">
                  <Trophy weight="fill" size={20} />
                  R$ 5.000
                </div>
              </div>
              <div>
                <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                  Próxima Partida
                </div>
                <div className="font-display italic font-black text-[26px] text-navy leading-none mt-1 flex items-center gap-1">
                  <Calendar weight="bold" size={18} />
                  Sáb · 19h
                </div>
              </div>
              <div>
                <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.1em]">
                  Final Prevista
                </div>
                <div className="font-display italic font-black text-[26px] text-navy leading-none mt-1">
                  28 Jun
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
