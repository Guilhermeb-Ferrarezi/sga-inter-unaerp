import{j as e}from"./router-BujQ3WVt.js";import{A as s}from"./icons-BMgckiBH.js";import{A as i}from"./AdminTopbar-BAUCSHQJ.js";import{a as d}from"./index-Bas1eqhH.js";import{u as n}from"./use-edition-CF9OJSX7.js";import{g as t}from"./apollo-CiAUcGy4.js";import"./use-matches-WToOZ-d6.js";import"./motion-YWvk1ye-.js";t`
  query Roster($editionTeamId: UUID!) {
    teams(editionId: "") {
      id
    }
  }
`;t`
  query Player($id: UUID!) {
    player(id: $id) {
      id
      sgaUserId
      ign
      avatarUrl
      role
    }
  }
`;function l(a="valorant"){const{loading:r,error:o}=n(a);return{players:[],loading:r,error:o}}function h(){const{players:a,loading:r}=l("valorant");return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Jogadores",subtitle:`${a.length} jogadores cadastrados`,actions:e.jsxs(d,{disabled:!0,children:[e.jsx(s,{weight:"bold",size:14}),"Novo jogador"]})}),e.jsx("div",{className:"p-9",children:r?e.jsx("div",{className:"text-center py-16 text-fg-mute font-display italic font-extrabold uppercase",children:"Carregando jogadores…"}):a.length===0?e.jsxs("div",{className:"bg-white border-[1.5px] border-border-strong p-9 text-center",children:[e.jsx("div",{className:"font-display italic font-black text-[28px] uppercase text-navy mb-3",children:"Nenhum jogador cadastrado"}),e.jsxs("p",{className:"text-fg-soft text-[14px] leading-relaxed max-w-md mx-auto",children:["Cadastre os times primeiro e depois adicione jogadores aos rosters via API GraphQL (mutation ",e.jsx("code",{className:"text-blue",children:"createPlayer"})," ","+ ",e.jsx("code",{className:"text-blue",children:"addPlayerToRoster"}),")."]})]}):null})]})}export{h as component};
