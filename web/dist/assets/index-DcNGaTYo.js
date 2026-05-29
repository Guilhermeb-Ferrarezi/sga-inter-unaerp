import{i as d,j as t}from"./router-BujQ3WVt.js";import{P as A}from"./PageHeader-vgp1tuMo.js";import{S as N}from"./section-B9nF3ama.js";import{F as h}from"./filter-pill-BOhzDBxC.js";import{M as w}from"./MatchCard-o-IESykQ.js";import{L as D}from"./LiveMatchFeature-bYiQUyMF.js";import{u as M}from"./use-edition-CF9OJSX7.js";import{d as S,g as C}from"./apollo-CiAUcGy4.js";import{e as B}from"./index-D6uXdVGG.js";import{m as E}from"./motion-YWvk1ye-.js";import"./icons-BMgckiBH.js";import"./team-logo-T2Uk4MWx.js";const I=C`
  query Matches($editionId: UUID!) {
    matches(editionId: $editionId) {
      id
      round
      status
      scheduledAt
      teamA {
        id
        team { id name slug primaryColor }
      }
      teamB {
        id
        team { id name slug primaryColor }
      }
      result {
        id
        map
        scoreA
        scoreB
        playedAt
        winner {
          id
          team { slug }
        }
      }
    }
  }
`,P=e=>{const s=e.toLowerCase();return s.includes("grupo a")?"A":s.includes("grupo b")?"B":s.includes("grupo c")?"C":s.includes("quart")?"Quartas":s.includes("semi")?"Semi":s.includes("final")?"Final":"A"};function $(e){const s=e.status==="live"?"live":e.status==="done"?"done":"scheduled";return{id:e.id,teamA:e.teamA.team.slug,teamB:e.teamB.team.slug,scheduledAt:e.scheduledAt??new Date().toISOString(),status:s,round:e.round,group:P(e.round),result:e.result?{winnerSlug:e.result.winner.team.slug,scoreA:e.result.scoreA,scoreB:e.result.scoreB,map:e.result.map??"",playedAt:e.result.playedAt}:void 0}}function k(e="valorant"){const s=M(e),{data:i,loading:n,error:r}=S(I,{variables:{editionId:s.edition?.id},skip:!s.edition?.id,errorPolicy:"all"});return{matches:(i?.matches??[]).map($),teams:s.teams,loading:s.loading||n,error:s.error||!!r}}const p=e=>e.status==="live",y=e=>e.status==="scheduled",v=e=>e.status==="done";function z(){const[e,s]=d.useState("all"),[i,n]=d.useState("all"),{matches:r,loading:o,error:b}=k("valorant"),m=d.useMemo(()=>{let a=r;return e==="live"?a=a.filter(p):e==="upcoming"?a=a.filter(y):e==="done"&&(a=a.filter(v)),i!=="all"&&(a=a.filter(l=>l.group===i)),a},[r,e,i]),f=d.useMemo(()=>F(m),[m]),x=r.find(p),c=d.useMemo(()=>({all:r.length,live:r.filter(p).length,upcoming:r.filter(y).length,done:r.filter(v).length}),[r]);return t.jsxs(t.Fragment,{children:[t.jsxs(A,{crumbs:[{to:"/",label:"Inter UnaERP"},{label:"Confrontos"}],tagNumber:"04",tagVariant:"teal",title:t.jsxs(t.Fragment,{children:["Agenda ",t.jsx("span",{className:"text-teal",children:"de Partidas"})]}),subtitle:"24 partidas previstas na fase de grupos · 12 disputadas até agora. Todas em MD1.",children:[t.jsx("div",{className:"flex gap-1 mt-6 border-b-2 border-navy",children:[["all",`Todas (${c.all})`],["live",`Ao Vivo (${c.live})`],["upcoming",`Próximas (${c.upcoming})`],["done",`Disputadas (${c.done})`]].map(([a,l])=>t.jsxs("button",{onClick:()=>s(a),className:B("font-display italic font-extrabold text-[16px] uppercase px-4.5 py-3 relative",e===a?"text-navy":"text-fg-mute hover:text-navy"),children:[l,e===a&&t.jsx("span",{className:"absolute -bottom-0.5 left-1.5 right-1.5 h-1 bg-lime"})]},a))}),t.jsxs("div",{className:"flex flex-wrap gap-2.5 mt-4.5",children:[t.jsx(h,{active:i==="all",onClick:()=>n("all"),children:"Todos os Grupos"}),["A","B","C"].map(a=>t.jsxs(h,{active:i===a,onClick:()=>n(a),children:["Grupo ",a]},a))]})]}),t.jsxs(N,{decoNum:"VS",children:[o&&t.jsx("div",{className:"text-center py-16 text-fg-mute font-display italic font-extrabold uppercase",children:"Carregando partidas…"}),b&&t.jsx("div",{className:"text-center py-16 text-red-500 font-display italic font-extrabold uppercase",children:"Erro ao carregar partidas"}),!o&&e!=="done"&&x&&e!=="upcoming"&&t.jsx(D,{match:x}),!o&&f.map(({label:a,weekday:l,items:u},j)=>t.jsxs(E.div,{initial:{opacity:0,y:12},animate:{opacity:1,y:0},transition:{duration:.3,delay:j*.04},className:"mt-9 first:mt-0",children:[t.jsxs("div",{className:"flex items-baseline gap-3.5 pb-3 border-b-2 border-navy mb-4.5",children:[t.jsx("span",{className:"font-display italic font-black text-[44px] leading-none text-navy",children:a.split(" ")[0]}),t.jsx("span",{className:"font-display italic font-extrabold text-[18px] text-fg-mute uppercase",children:a.split(" ")[1]}),t.jsx("span",{className:"text-[11.5px] text-blue font-extrabold uppercase tracking-[0.12em] ml-auto",children:l}),t.jsxs("span",{className:"text-[11px] text-fg-mute font-extrabold uppercase tracking-[0.1em]",children:[u.length," partida",u.length===1?"":"s"]})]}),u.map(g=>t.jsx(w,{match:g},g.id))]},a)),f.length===0&&t.jsx("div",{className:"text-center py-16 text-fg-mute font-display italic font-extrabold uppercase",children:"Nenhuma partida encontrada para esse filtro."})]})]})}function F(e){const s=new Map;for(const i of e){const n=new Date(i.scheduledAt),r=`${n.getDate().toString().padStart(2,"0")} ${n.toLocaleString("pt-BR",{month:"short"}).replace(".","")}`;s.has(r)||s.set(r,[]),s.get(r).push(i)}return Array.from(s.entries()).map(([i,n])=>{const r=new Date(n[0].scheduledAt),o=new Intl.DateTimeFormat("pt-BR",{weekday:"long"}).format(r);return{label:i,weekday:o,items:n}}).sort((i,n)=>+new Date(i.items[0].scheduledAt)-+new Date(n.items[0].scheduledAt))}export{z as component};
