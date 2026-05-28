import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  UploadSimple,
  CheckCircle,
  WarningCircle,
  Code,
  Archive,
} from "@phosphor-icons/react";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/importar")({
  component: AdminImportPage,
});

const samplePayload = `{
  "game": "valorant",
  "year": 2024,
  "name": "Inter UnaERP 2024",
  "teams": [
    {
      "name": "Olimpo",
      "slug": "olimpo-2024",
      "color": "#0073B7",
      "players": [
        { "ign": "g1lh", "role": "Duelist", "isCaptain": true },
        { "ign": "t4t", "role": "Initiator", "isCaptain": false }
      ]
    }
  ],
  "matches": [
    {
      "teamA": "olimpo-2024",
      "teamB": "thunder-2024",
      "round": "Final",
      "map": "Pearl",
      "scoreA": 13,
      "scoreB": 9,
      "winner": "olimpo-2024"
    }
  ]
}`;

function AdminImportPage() {
  const [payload, setPayload] = useState("");
  const [status, setStatus] = useState<"idle" | "validating" | "ready" | "error">(
    "idle"
  );
  const [parsed, setParsed] = useState<any>(null);
  const [error, setError] = useState("");

  const validate = () => {
    setStatus("validating");
    try {
      const p = JSON.parse(payload);
      if (!p.game || !p.year || !p.name) {
        throw new Error("Faltam campos obrigatórios: game, year, name");
      }
      setParsed(p);
      setError("");
      setStatus("ready");
    } catch (e: any) {
      setError(e.message);
      setStatus("error");
    }
  };

  return (
    <>
      <AdminTopbar
        title="Importar edição histórica"
        subtitle="Reconstrua edições passadas via payload JSON. Suporta times, jogadores, partidas e resultados."
      />

      <div className="p-9 grid lg:grid-cols-[1fr_320px] gap-7">
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white border-[1.5px] border-border-strong shadow-brutal-sm"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="font-display italic font-black text-[16px] uppercase text-navy flex items-center gap-2">
                <Code weight="bold" size={16} className="text-blue" />
                Payload JSON
              </div>
              <button
                onClick={() => setPayload(samplePayload)}
                className="text-[11px] text-blue font-extrabold uppercase tracking-[0.1em] hover:text-navy"
              >
                Carregar exemplo
              </button>
            </div>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              placeholder="Cole aqui o payload JSON da edição..."
              className="w-full h-[420px] bg-surface-3 p-5 font-mono text-[12.5px] outline-none resize-none border-none focus:bg-white transition-colors"
            />
            <div className="flex items-center justify-between px-5 py-4 border-t border-border bg-surface-3">
              <div className="text-[11.5px] text-fg-soft">
                {payload.length > 0
                  ? `${payload.length} caracteres`
                  : "Aguardando entrada"}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPayload("");
                    setStatus("idle");
                    setParsed(null);
                  }}
                >
                  Limpar
                </Button>
                <Button onClick={validate} disabled={!payload.length} size="sm">
                  Validar
                </Button>
              </div>
            </div>
          </motion.div>

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-[1.5px] border-red-300 p-4 flex items-start gap-3"
            >
              <WarningCircle weight="fill" size={20} className="text-red-500 mt-0.5" />
              <div>
                <div className="font-display italic font-black text-[14px] uppercase text-red-700">
                  Erro de validação
                </div>
                <div className="text-[13px] text-red-600 mt-1">{error}</div>
              </div>
            </motion.div>
          )}

          {status === "ready" && parsed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border-[1.5px] border-lime shadow-brutal-lime p-5 brackets-lime"
            >
              <div className="flex items-start gap-3 mb-4">
                <CheckCircle weight="fill" size={24} className="text-lime mt-0.5" />
                <div>
                  <div className="font-display italic font-black text-[20px] uppercase text-navy">
                    Payload válido
                  </div>
                  <div className="text-[13px] text-fg-soft mt-1">
                    {parsed.name} ({parsed.year}) — pronto para importar.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-4 border-y border-border my-4">
                <Preview label="Times" value={parsed.teams?.length ?? 0} />
                <Preview
                  label="Jogadores"
                  value={
                    parsed.teams?.reduce(
                      (acc: number, t: any) => acc + (t.players?.length ?? 0),
                      0
                    ) ?? 0
                  }
                />
                <Preview label="Partidas" value={parsed.matches?.length ?? 0} />
              </div>

              <div className="flex gap-3">
                <Button variant="primary">
                  <UploadSimple weight="bold" size={14} />
                  Importar agora
                </Button>
                <Button variant="ghost">Pré-visualizar diff</Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar — instruções + status */}
        <div className="space-y-5">
          <div className="bg-white border-[1.5px] border-border-strong p-5 shadow-brutal-sm">
            <div className="font-display italic font-black text-[16px] uppercase text-navy mb-4 pb-2.5 border-b border-border flex items-center gap-2">
              <Archive weight="bold" size={14} className="text-blue" />
              Estrutura esperada
            </div>
            <ol className="space-y-2.5 text-[12.5px] text-fg-soft">
              <Step n="1" text="game (slug · ex: valorant)" />
              <Step n="2" text="year + name da edição" />
              <Step n="3" text="teams[] com players[]" />
              <Step n="4" text="matches[] com winner por slug" />
              <Step n="5" text="winner deve ser um dos teams" />
            </ol>
          </div>

          <div className="bg-white border-[1.5px] border-border-strong p-5 shadow-brutal-sm">
            <div className="font-display italic font-black text-[16px] uppercase text-navy mb-4 pb-2.5 border-b border-border">
              Imports recentes
            </div>
            <div className="space-y-2.5">
              <ImportRow year="2024" status="finished" teams={8} when="3 sem atrás" />
              <ImportRow year="2023" status="finished" teams={6} when="3 sem atrás" />
              <ImportRow year="2022" status="finished" teams={6} when="1 mês atrás" />
            </div>
          </div>

          <div className="bg-blue/[0.08] border-[1.5px] border-blue/30 p-4">
            <div className="text-[11px] text-blue font-extrabold uppercase tracking-[0.1em] mb-1.5">
              Dica do Henrique
            </div>
            <div className="text-[12px] text-fg-soft leading-relaxed">
              Use o sistema de slugs únicos por edição (ex: <code className="bg-white px-1 text-[11px]">olimpo-2024</code>) pra evitar colisões com times atuais.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function Preview({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="font-display italic font-black text-[32px] text-blue leading-none tabular-nums">
        {value}
      </div>
      <div className="text-[10px] text-fg-mute font-extrabold uppercase tracking-[0.1em] mt-1">
        {label}
      </div>
    </div>
  );
}

function Step({ n, text }: { n: string; text: string }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="w-5 h-5 bg-navy text-white font-display italic font-black text-[10px] flex items-center justify-center shrink-0">
        {n}
      </span>
      <span>{text}</span>
    </li>
  );
}

function ImportRow({
  year,
  status,
  teams,
  when,
}: {
  year: string;
  status: string;
  teams: number;
  when: string;
}) {
  return (
    <div className="flex items-center gap-3 py-1.5 px-2 hover:bg-surface-3 cursor-pointer transition-colors">
      <CheckCircle weight="fill" size={14} className="text-teal" />
      <div className="flex-1">
        <div className="font-display italic font-extrabold text-[13px] uppercase text-navy">
          Inter UnaERP {year}
        </div>
        <div className="text-[10px] text-fg-mute font-bold uppercase tracking-[0.06em]">
          {teams} times · {when} · {status}
        </div>
      </div>
    </div>
  );
}
