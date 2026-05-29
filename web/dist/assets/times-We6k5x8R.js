import{i as c,j as e}from"./router-BujQ3WVt.js";import{A as b,p as v,V as F,J as E}from"./icons-BMgckiBH.js";import{A as w}from"./AdminTopbar-BAUCSHQJ.js";import{D as C,R as G}from"./RowActions-Cu6u6NF0.js";import{T as D}from"./team-logo-BK4ln0bD.js";import{a as x,e as M}from"./index-Bas1eqhH.js";import{u as k}from"./use-edition-CF9OJSX7.js";import{g as a,u as R}from"./apollo-CiAUcGy4.js";import{m as B}from"./motion-YWvk1ye-.js";import"./use-matches-WToOZ-d6.js";const U=a`
  fragment GameFields on Game {
    id
    slug
    name
    coverUrl
    active
  }
`,h=a`
  fragment TeamFields on Team {
    id
    name
    slug
    logoUrl
    primaryColor
  }
`,$=a`
  fragment EditionTeamFields on EditionTeam {
    id
    seed
    finalPlacement
    wins
    losses
    team {
      ...TeamFields
    }
  }
  ${h}
`,f=a`
  fragment EditionFields on Edition {
    id
    year
    name
    status
    startedAt
    endedAt
    game {
      ...GameFields
    }
  }
  ${U}
`,j=a`
  fragment PlayerFields on Player {
    id
    sgaUserId
    ign
    avatarUrl
    role
  }
`,I=a`
  fragment MatchFields on Match {
    id
    round
    scheduledAt
    status
    teamA {
      ...EditionTeamFields
    }
    teamB {
      ...EditionTeamFields
    }
    result {
      id
      map
      scoreA
      scoreB
      playedAt
      winner {
        id
        team {
          slug
          name
        }
      }
    }
  }
  ${$}
`,N=a`
  fragment HighlightFields on Highlight {
    id
    cfStreamId
    title
    thumbnailUrl
    publishedAt
  }
`;a`
  query GetHome($gameSlug: String!) {
    activeEdition(gameSlug: $gameSlug) {
      ...EditionFields
    }
    games {
      ...GameFields
    }
  }
  ${f}
  ${U}
`;a`
  query GetTeamsByEdition($editionId: UUID!) {
    teams(editionId: $editionId) {
      ...EditionTeamFields
    }
  }
  ${$}
`;a`
  query GetTeamBySlug($slug: String!) {
    team(slug: $slug) {
      ...TeamFields
    }
  }
  ${h}
`;a`
  query GetStandings($editionId: UUID!) {
    standings(editionId: $editionId) {
      wins
      losses
      finalPlacement
      editionTeam {
        ...EditionTeamFields
      }
    }
  }
  ${$}
`;a`
  query GetMatches($editionId: UUID!, $round: String) {
    matches(editionId: $editionId, round: $round) {
      ...MatchFields
    }
  }
  ${I}
`;a`
  query GetMatch($id: UUID!) {
    match(id: $id) {
      ...MatchFields
      edition {
        ...EditionFields
      }
    }
  }
  ${I}
  ${f}
`;a`
  query GetPlayer($id: UUID!) {
    player(id: $id) {
      ...PlayerFields
    }
  }
  ${j}
`;a`
  query GetHighlights($editionId: UUID!) {
    highlights(editionId: $editionId) {
      ...HighlightFields
    }
  }
  ${N}
`;a`
  query GetGallery($editionId: UUID!) {
    gallery(editionId: $editionId) {
      id
      r2Key
      url
      caption
      type
    }
  }
`;a`
  query GetEditions($gameSlug: String!) {
    editions(gameSlug: $gameSlug) {
      ...EditionFields
    }
  }
  ${f}
`;const _=a`
  mutation CreateTeam(
    $name: String!
    $slug: String!
    $logoUrl: String
    $primaryColor: String
  ) {
    createTeam(
      name: $name
      slug: $slug
      logoUrl: $logoUrl
      primaryColor: $primaryColor
    ) {
      ...TeamFields
    }
  }
  ${h}
`;a`
  mutation CreatePlayer(
    $ign: String!
    $sgaUserId: Int
    $avatarUrl: String
    $role: String
  ) {
    createPlayer(
      ign: $ign
      sgaUserId: $sgaUserId
      avatarUrl: $avatarUrl
      role: $role
    ) {
      ...PlayerFields
    }
  }
  ${j}
`;a`
  mutation CreateMatch(
    $editionId: UUID!
    $teamAId: UUID!
    $teamBId: UUID!
    $round: String!
    $scheduledAt: Time
  ) {
    createMatch(
      editionId: $editionId
      teamAId: $teamAId
      teamBId: $teamBId
      round: $round
      scheduledAt: $scheduledAt
    ) {
      ...MatchFields
    }
  }
  ${I}
`;a`
  mutation RecordResult(
    $matchId: UUID!
    $winnerId: UUID!
    $map: String
    $scoreA: Int!
    $scoreB: Int!
  ) {
    recordResult(
      matchId: $matchId
      winnerId: $winnerId
      map: $map
      scoreA: $scoreA
      scoreB: $scoreB
    ) {
      id
      map
      scoreA
      scoreB
      playedAt
    }
  }
`;a`
  mutation UploadMediaPresignedUrl(
    $editionId: UUID!
    $matchId: UUID
    $fileType: String!
    $mediaType: String!
  ) {
    uploadMediaPresignedUrl(
      editionId: $editionId
      matchId: $matchId
      fileType: $fileType
      mediaType: $mediaType
    ) {
      uploadUrl
      publicUrl
      r2Key
    }
  }
`;a`
  mutation ConfirmMediaUpload(
    $editionId: UUID!
    $matchId: UUID
    $r2Key: String!
    $url: String!
    $caption: String
    $mediaType: String!
  ) {
    confirmMediaUpload(
      editionId: $editionId
      matchId: $matchId
      r2Key: $r2Key
      url: $url
      caption: $caption
      mediaType: $mediaType
    ) {
      id
      url
      caption
      type
    }
  }
`;a`
  mutation CreateHighlight(
    $editionId: UUID!
    $matchId: UUID
    $cfStreamId: String!
    $title: String!
    $thumbnailUrl: String
  ) {
    createHighlight(
      editionId: $editionId
      matchId: $matchId
      cfStreamId: $cfStreamId
      title: $title
      thumbnailUrl: $thumbnailUrl
    ) {
      ...HighlightFields
    }
  }
  ${N}
`;a`
  mutation ImportEdition($payload: String!) {
    importEdition(payload: $payload)
  }
`;function W(){const[l,n]=c.useState(!1),{teams:t,loading:d}=k("valorant"),[o,r]=c.useState([]);return c.useEffect(()=>{r(t)},[t]),e.jsxs(e.Fragment,{children:[e.jsx(w,{title:"Times",subtitle:`${o.length} times cadastrados na edição Valorant 2025`,actions:e.jsxs(x,{onClick:()=>n(!0),children:[e.jsx(b,{weight:"bold",size:14}),"Novo time"]})}),e.jsxs("div",{className:"p-9",children:[l&&e.jsx(P,{onClose:()=>n(!1),onCreated:i=>{r(g=>[i,...g]),n(!1)}}),d&&o.length===0?e.jsx("div",{className:"text-center py-16 text-fg-mute font-display italic font-extrabold uppercase",children:"Carregando times…"}):e.jsx(C,{columns:[{key:"name",header:"Time",width:"minmax(0, 1.6fr)",render:i=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(D,{shortName:i.shortName,color:i.color,size:"sm"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-display italic font-extrabold text-[15px] uppercase text-navy leading-none",children:i.name}),e.jsxs("div",{className:"text-[10.5px] text-fg-mute font-bold uppercase tracking-[0.08em] mt-0.5",children:["@",i.slug]})]})]})},{key:"group",header:"Grupo",width:"80px",className:"text-center",render:i=>e.jsx("span",{className:"font-display italic font-black text-[16px] text-navy",children:i.group})},{key:"roster",header:"Roster",width:"100px",className:"text-center",render:()=>e.jsx("span",{className:"text-[13px] font-bold text-fg-mute",children:"—"})},{key:"record",header:"V · D",width:"100px",className:"text-center",render:i=>e.jsxs("span",{className:"font-display italic font-black text-[16px] tabular-nums",children:[e.jsx("span",{className:"text-teal",children:i.wins}),e.jsx("span",{className:"text-fg-mute mx-1",children:"·"}),e.jsx("span",{className:"text-fg-mute",children:i.losses})]})},{key:"captain",header:"Capitão",width:"minmax(0, 0.6fr)",render:i=>e.jsx("span",{className:"text-[13px] text-fg-soft font-semibold",children:i.captainIgn})},{key:"actions",header:"Ações",width:"120px",className:"text-right",render:()=>e.jsx(G,{onView:()=>{},onEdit:()=>{},onDelete:()=>{}})}],rows:o,rowKey:i=>i.id})]})]})}function P({onClose:l,onCreated:n}){const[t,d]=c.useState({name:"",slug:"",color:"#0073B7",group:"A",captainIgn:""}),[o,{loading:r,error:i}]=R(_),[g,T]=c.useState(!1),m=(s,u)=>d(S=>({...S,[s]:u})),y=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),A=async s=>{if(s.preventDefault(),!t.name.trim()||!t.slug.trim())return;const u={id:`temp-${Date.now()}`,slug:t.slug,name:t.name,shortName:t.name.slice(0,2).toUpperCase(),color:t.color,group:t.group,wins:0,losses:0,pointsDiff:0,points:0,rosterIds:[],captainIgn:t.captainIgn||"—"};try{await o({variables:{name:t.name,slug:t.slug,primaryColor:t.color}}),T(!0),n(u)}catch{}};return e.jsxs(B.div,{initial:{opacity:0,y:-12,height:0},animate:{opacity:1,y:0,height:"auto"},exit:{opacity:0,y:-12,height:0},transition:{duration:.25},className:"bg-white border-[1.5px] border-border-strong shadow-brutal-lime p-7 mb-7 brackets-lime relative",children:[e.jsxs("div",{className:"flex items-center justify-between mb-5",children:[e.jsx("h3",{className:"font-display italic font-black text-[24px] uppercase text-navy",children:"Novo time"}),e.jsx("button",{onClick:l,className:"text-fg-mute hover:text-navy font-display italic font-extrabold uppercase text-[12px]",children:"✕ Cancelar"})]}),i&&e.jsxs("div",{className:"mb-5 bg-red-500/10 border border-red-500 text-navy p-3.5 flex items-start gap-3 text-[12.5px]",children:[e.jsx(v,{weight:"fill",size:18,className:"shrink-0 mt-0.5 text-red-500"}),e.jsxs("div",{children:[e.jsx("strong",{className:"font-display italic font-extrabold uppercase mr-2",children:"Erro ao criar"}),i.message]})]}),g&&!i&&e.jsxs("div",{className:"mb-5 bg-teal/10 border border-teal text-navy p-3.5 flex items-start gap-3 text-[13px]",children:[e.jsx(F,{weight:"fill",size:18,className:"shrink-0 mt-0.5 text-teal"}),e.jsxs("span",{children:[e.jsx("strong",{className:"font-display italic font-extrabold uppercase mr-2",children:"Sucesso"}),"Time criado e persistido via GraphQL."]})]}),e.jsxs("form",{onSubmit:A,className:"grid grid-cols-2 gap-5",children:[e.jsx(p,{label:"Nome",placeholder:"Olimpo",value:t.name,onChange:s=>{m("name",s),(!t.slug||t.slug===y(t.name))&&m("slug",y(s))}}),e.jsx(p,{label:"Slug",placeholder:"olimpo",hint:"usado em URLs · auto-gerado do nome",value:t.slug,onChange:s=>m("slug",s)}),e.jsx(p,{label:"Cor primária",placeholder:"#0073B7",type:"color",value:t.color,onChange:s=>m("color",s)}),e.jsxs("label",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]",children:"Grupo"}),e.jsxs("select",{value:t.group,onChange:s=>m("group",s.target.value),className:"bg-surface-3 border border-border-strong px-3 py-2.5 text-[13.5px] focus:border-blue focus:outline-none focus:[box-shadow:3px_3px_0_#0A1A3D] transition-all font-medium",children:[e.jsx("option",{value:"A",children:"Grupo A"}),e.jsx("option",{value:"B",children:"Grupo B"}),e.jsx("option",{value:"C",children:"Grupo C"})]})]}),e.jsx(p,{label:"Capitão (IGN)",placeholder:"g1lh",value:t.captainIgn,onChange:s=>m("captainIgn",s)}),e.jsxs("div",{className:"col-span-2 flex items-center gap-3 pt-3 border-t border-border",children:[e.jsx(x,{type:"submit",disabled:r||!t.name||!t.slug,children:r?e.jsxs(e.Fragment,{children:[e.jsx(E,{weight:"bold",size:14,className:"animate-spin"}),"Criando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(b,{weight:"bold",size:14}),"Criar time"]})}),e.jsx(x,{type:"button",variant:"ghost",onClick:l,disabled:r,children:"Cancelar"}),e.jsxs("span",{className:"ml-auto text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.08em]",children:["Endpoint:"," ",e.jsx("code",{className:"text-blue normal-case",children:"createTeam"})]})]})]})]})}function p({label:l,placeholder:n,hint:t,type:d="text",value:o,onChange:r}){return e.jsxs("label",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]",children:l}),e.jsx("input",{type:d,placeholder:n,value:o,onChange:i=>r?.(i.target.value),className:M("bg-surface-3 border border-border-strong px-3 py-2.5 text-[13.5px] focus:border-blue focus:outline-none focus:[box-shadow:3px_3px_0_#0A1A3D] transition-all",d==="color"&&"h-11 cursor-pointer p-1")}),t&&e.jsx("span",{className:"text-[10.5px] text-fg-mute",children:t})]})}export{W as component};
