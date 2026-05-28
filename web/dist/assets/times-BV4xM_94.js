import{i as g,j as e}from"./router-BujQ3WVt.js";import{B as y,p as v,W as S,K as E}from"./icons-B8VezJ9f.js";import{A as w}from"./AdminTopbar-SMUfoNmF.js";import{D as C,R as G}from"./RowActions-CI3HloiC.js";import{T as D}from"./team-logo-BJLscZMV.js";import{r as M,a as u,q as k,e as B}from"./index-BGHQgOr2.js";import{g as a,u as R}from"./apollo-CiAUcGy4.js";import{m as P}from"./motion-YWvk1ye-.js";const b=a`
  fragment GameFields on Game {
    id
    slug
    name
    coverUrl
    active
  }
`,x=a`
  fragment TeamFields on Team {
    id
    name
    slug
    logoUrl
    primaryColor
  }
`,h=a`
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
  ${x}
`,$=a`
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
  ${b}
`,U=a`
  fragment PlayerFields on Player {
    id
    sgaUserId
    ign
    avatarUrl
    role
  }
`,f=a`
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
  ${h}
`,j=a`
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
  ${$}
  ${b}
`;a`
  query GetTeamsByEdition($editionId: UUID!) {
    teams(editionId: $editionId) {
      ...EditionTeamFields
    }
  }
  ${h}
`;a`
  query GetTeamBySlug($slug: String!) {
    team(slug: $slug) {
      ...TeamFields
    }
  }
  ${x}
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
  ${h}
`;a`
  query GetMatches($editionId: UUID!, $round: String) {
    matches(editionId: $editionId, round: $round) {
      ...MatchFields
    }
  }
  ${f}
`;a`
  query GetMatch($id: UUID!) {
    match(id: $id) {
      ...MatchFields
      edition {
        ...EditionFields
      }
    }
  }
  ${f}
  ${$}
`;a`
  query GetPlayer($id: UUID!) {
    player(id: $id) {
      ...PlayerFields
    }
  }
  ${U}
`;a`
  query GetHighlights($editionId: UUID!) {
    highlights(editionId: $editionId) {
      ...HighlightFields
    }
  }
  ${j}
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
  ${$}
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
  ${x}
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
  ${U}
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
  ${f}
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
  ${j}
`;a`
  mutation ImportEdition($payload: String!) {
    importEdition(payload: $payload)
  }
`;function Y(){const[o,r]=g.useState(!1),[t,l]=g.useState(M);return e.jsxs(e.Fragment,{children:[e.jsx(w,{title:"Times",subtitle:`${t.length} times cadastrados na edição Valorant 2025`,actions:e.jsxs(u,{onClick:()=>r(!0),children:[e.jsx(y,{weight:"bold",size:14}),"Novo time"]})}),e.jsxs("div",{className:"p-9",children:[o&&e.jsx(q,{onClose:()=>r(!1),onCreated:i=>{l(n=>[i,...n]),r(!1)}}),e.jsx(C,{columns:[{key:"name",header:"Time",width:"minmax(0, 1.6fr)",render:i=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(D,{shortName:i.shortName,color:i.color,size:"sm"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-display italic font-extrabold text-[15px] uppercase text-navy leading-none",children:i.name}),e.jsxs("div",{className:"text-[10.5px] text-fg-mute font-bold uppercase tracking-[0.08em] mt-0.5",children:["@",i.slug]})]})]})},{key:"group",header:"Grupo",width:"80px",className:"text-center",render:i=>e.jsx("span",{className:"font-display italic font-black text-[16px] text-navy",children:i.group})},{key:"roster",header:"Roster",width:"100px",className:"text-center",render:i=>e.jsxs("span",{className:"text-[13px] font-bold text-navy",children:[k(i.slug).length," / 5"]})},{key:"record",header:"V · D",width:"100px",className:"text-center",render:i=>e.jsxs("span",{className:"font-display italic font-black text-[16px] tabular-nums",children:[e.jsx("span",{className:"text-teal",children:i.wins}),e.jsx("span",{className:"text-fg-mute mx-1",children:"·"}),e.jsx("span",{className:"text-fg-mute",children:i.losses})]})},{key:"captain",header:"Capitão",width:"minmax(0, 0.6fr)",render:i=>e.jsx("span",{className:"text-[13px] text-fg-soft font-semibold",children:i.captainIgn})},{key:"actions",header:"Ações",width:"120px",className:"text-right",render:()=>e.jsx(G,{onView:()=>{},onEdit:()=>{},onDelete:()=>{}})}],rows:t,rowKey:i=>i.id})]})]})}function q({onClose:o,onCreated:r}){const[t,l]=g.useState({name:"",slug:"",color:"#0073B7",group:"A",captainIgn:""}),[i,{loading:n,error:m}]=R(_),[N,T]=g.useState(!1),d=(s,c)=>l(F=>({...F,[s]:c})),I=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),A=async s=>{if(s.preventDefault(),!t.name.trim()||!t.slug.trim())return;const c={id:`temp-${Date.now()}`,slug:t.slug,name:t.name,shortName:t.name.slice(0,2).toUpperCase(),color:t.color,group:t.group,wins:0,losses:0,pointsDiff:0,points:0,rosterIds:[],captainIgn:t.captainIgn||"—"};try{await i({variables:{name:t.name,slug:t.slug,primaryColor:t.color}}),T(!0),r(c)}catch{r(c)}};return e.jsxs(P.div,{initial:{opacity:0,y:-12,height:0},animate:{opacity:1,y:0,height:"auto"},exit:{opacity:0,y:-12,height:0},transition:{duration:.25},className:"bg-white border-[1.5px] border-border-strong shadow-brutal-lime p-7 mb-7 brackets-lime relative",children:[e.jsxs("div",{className:"flex items-center justify-between mb-5",children:[e.jsx("h3",{className:"font-display italic font-black text-[24px] uppercase text-navy",children:"Novo time"}),e.jsx("button",{onClick:o,className:"text-fg-mute hover:text-navy font-display italic font-extrabold uppercase text-[12px]",children:"✕ Cancelar"})]}),m&&e.jsxs("div",{className:"mb-5 bg-[#F5B700]/15 border border-[#F5B700] text-navy p-3.5 flex items-start gap-3 text-[12.5px]",children:[e.jsx(v,{weight:"fill",size:18,className:"shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("strong",{className:"font-display italic font-extrabold uppercase mr-2",children:"API offline"}),"O time foi criado localmente em modo demo. Quando a API voltar, tente novamente para persistir no banco."]})]}),N&&!m&&e.jsxs("div",{className:"mb-5 bg-teal/10 border border-teal text-navy p-3.5 flex items-start gap-3 text-[13px]",children:[e.jsx(S,{weight:"fill",size:18,className:"shrink-0 mt-0.5 text-teal"}),e.jsxs("span",{children:[e.jsx("strong",{className:"font-display italic font-extrabold uppercase mr-2",children:"Sucesso"}),"Time criado e persistido via GraphQL."]})]}),e.jsxs("form",{onSubmit:A,className:"grid grid-cols-2 gap-5",children:[e.jsx(p,{label:"Nome",placeholder:"Olimpo",value:t.name,onChange:s=>{d("name",s),(!t.slug||t.slug===I(t.name))&&d("slug",I(s))}}),e.jsx(p,{label:"Slug",placeholder:"olimpo",hint:"usado em URLs · auto-gerado do nome",value:t.slug,onChange:s=>d("slug",s)}),e.jsx(p,{label:"Cor primária",placeholder:"#0073B7",type:"color",value:t.color,onChange:s=>d("color",s)}),e.jsxs("label",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]",children:"Grupo"}),e.jsxs("select",{value:t.group,onChange:s=>d("group",s.target.value),className:"bg-surface-3 border border-border-strong px-3 py-2.5 text-[13.5px] focus:border-blue focus:outline-none focus:[box-shadow:3px_3px_0_#0A1A3D] transition-all font-medium",children:[e.jsx("option",{value:"A",children:"Grupo A"}),e.jsx("option",{value:"B",children:"Grupo B"}),e.jsx("option",{value:"C",children:"Grupo C"})]})]}),e.jsx(p,{label:"Capitão (IGN)",placeholder:"g1lh",value:t.captainIgn,onChange:s=>d("captainIgn",s)}),e.jsxs("div",{className:"col-span-2 flex items-center gap-3 pt-3 border-t border-border",children:[e.jsx(u,{type:"submit",disabled:n||!t.name||!t.slug,children:n?e.jsxs(e.Fragment,{children:[e.jsx(E,{weight:"bold",size:14,className:"animate-spin"}),"Criando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(y,{weight:"bold",size:14}),"Criar time"]})}),e.jsx(u,{type:"button",variant:"ghost",onClick:o,disabled:n,children:"Cancelar"}),e.jsxs("span",{className:"ml-auto text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.08em]",children:["Endpoint:"," ",e.jsx("code",{className:"text-blue normal-case",children:"createTeam"})]})]})]})]})}function p({label:o,placeholder:r,hint:t,type:l="text",value:i,onChange:n}){return e.jsxs("label",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]",children:o}),e.jsx("input",{type:l,placeholder:r,value:i,onChange:m=>n?.(m.target.value),className:B("bg-surface-3 border border-border-strong px-3 py-2.5 text-[13.5px] focus:border-blue focus:outline-none focus:[box-shadow:3px_3px_0_#0A1A3D] transition-all",l==="color"&&"h-11 cursor-pointer p-1")}),t&&e.jsx("span",{className:"text-[10.5px] text-fg-mute",children:t})]})}export{Y as component};
