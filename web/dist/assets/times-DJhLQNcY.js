import{i as d,j as e}from"./router-BujQ3WVt.js";import{A as S,p as v,V as M,J as k}from"./icons-BMgckiBH.js";import{A as R}from"./AdminTopbar-CZB7NYFH.js";import{D as B,R as _}from"./RowActions-DDEv6O4M.js";import{T as P}from"./team-logo-DXNUt0xO.js";import{a as I,e as H}from"./index-_fUQhOG-.js";import{u as q}from"./use-edition-NPEhu2j8.js";import{g as a,u as A}from"./apollo-aN69TzWM.js";import{m as z}from"./motion-YWvk1ye-.js";import"./use-matches-BOes-dLB.js";const E=a`
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
`,y=a`
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
`,b=a`
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
  ${E}
`,F=a`
  fragment PlayerFields on Player {
    id
    sgaUserId
    ign
    avatarUrl
    role
  }
`,T=a`
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
  ${y}
`,w=a`
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
  ${b}
  ${E}
`;a`
  query GetTeamsByEdition($editionId: UUID!) {
    teams(editionId: $editionId) {
      ...EditionTeamFields
    }
  }
  ${y}
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
  ${y}
`;a`
  query GetMatches($editionId: UUID!, $round: String) {
    matches(editionId: $editionId, round: $round) {
      ...MatchFields
    }
  }
  ${T}
`;a`
  query GetMatch($id: UUID!) {
    match(id: $id) {
      ...MatchFields
      edition {
        ...EditionFields
      }
    }
  }
  ${T}
  ${b}
`;a`
  query GetPlayer($id: UUID!) {
    player(id: $id) {
      ...PlayerFields
    }
  }
  ${F}
`;a`
  query GetHighlights($editionId: UUID!) {
    highlights(editionId: $editionId) {
      ...HighlightFields
    }
  }
  ${w}
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
  ${b}
`;const L=a`
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
`,K=a`
  mutation AddTeamToEdition($editionId: UUID!, $teamId: UUID!, $seed: Int) {
    addTeamToEdition(editionId: $editionId, teamId: $teamId, seed: $seed) {
      id
      wins
      losses
      finalPlacement
      team {
        ...TeamFields
      }
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
  ${F}
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
  ${T}
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
  ${w}
`;a`
  mutation ImportEdition($payload: String!) {
    importEdition(payload: $payload)
  }
`;function ie(){const[n,r]=d.useState(!1),{teams:o,loading:t,edition:p}=q("valorant"),[l,m]=d.useState([]);return d.useEffect(()=>{m(o)},[o]),e.jsxs(e.Fragment,{children:[e.jsx(R,{title:"Times",subtitle:`${l.length} times cadastrados na edição Valorant 2025`,actions:e.jsxs(I,{onClick:()=>r(!0),children:[e.jsx(S,{weight:"bold",size:14}),"Novo time"]})}),e.jsxs("div",{className:"p-9",children:[n&&e.jsx(O,{editionId:p?.id??null,onClose:()=>r(!1),onCreated:i=>{m(g=>[i,...g]),r(!1)}}),t&&l.length===0?e.jsx("div",{className:"text-center py-16 text-fg-mute font-display italic font-extrabold uppercase",children:"Carregando times…"}):e.jsx(B,{columns:[{key:"name",header:"Time",width:"minmax(0, 1.6fr)",render:i=>e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx(P,{shortName:i.shortName,color:i.color,size:"sm"}),e.jsxs("div",{children:[e.jsx("div",{className:"font-display italic font-extrabold text-[15px] uppercase text-navy leading-none",children:i.name}),e.jsxs("div",{className:"text-[10.5px] text-fg-mute font-bold uppercase tracking-[0.08em] mt-0.5",children:["@",i.slug]})]})]})},{key:"group",header:"Grupo",width:"80px",className:"text-center",render:i=>e.jsx("span",{className:"font-display italic font-black text-[16px] text-navy",children:i.group})},{key:"roster",header:"Roster",width:"100px",className:"text-center",render:()=>e.jsx("span",{className:"text-[13px] font-bold text-fg-mute",children:"—"})},{key:"record",header:"V · D",width:"100px",className:"text-center",render:i=>e.jsxs("span",{className:"font-display italic font-black text-[16px] tabular-nums",children:[e.jsx("span",{className:"text-teal",children:i.wins}),e.jsx("span",{className:"text-fg-mute mx-1",children:"·"}),e.jsx("span",{className:"text-fg-mute",children:i.losses})]})},{key:"captain",header:"Capitão",width:"minmax(0, 0.6fr)",render:i=>e.jsx("span",{className:"text-[13px] text-fg-soft font-semibold",children:i.captainIgn})},{key:"actions",header:"Ações",width:"120px",className:"text-right",render:()=>e.jsx(_,{onView:()=>{},onEdit:()=>{},onDelete:()=>{}})}],rows:l,rowKey:i=>i.id})]})]})}function O({editionId:n,onClose:r,onCreated:o}){const[t,p]=d.useState({name:"",slug:"",color:"#0073B7",group:"A",captainIgn:""}),[l]=A(L),[m]=A(K,{refetchQueries:["ActiveEdition"],awaitRefetchQueries:!0}),[i,g]=d.useState(!1),[$,U]=d.useState(null),[C,D]=d.useState(!1),c=(s,f)=>p(u=>({...u,[s]:f})),j=s=>s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""),G=async s=>{if(s.preventDefault(),!t.name.trim()||!t.slug.trim())return;const f={id:`temp-${Date.now()}`,slug:t.slug,name:t.name,shortName:t.name.slice(0,2).toUpperCase(),color:t.color,group:t.group,wins:0,losses:0,pointsDiff:0,points:0,rosterIds:[],captainIgn:t.captainIgn||"—"};g(!0),U(null);try{const N=(await l({variables:{name:t.name,slug:t.slug,primaryColor:t.color}})).data?.createTeam?.id;N&&n&&await m({variables:{editionId:n,teamId:N}}),D(!0),o(f)}catch(u){U(u)}finally{g(!1)}};return e.jsxs(z.div,{initial:{opacity:0,y:-12,height:0},animate:{opacity:1,y:0,height:"auto"},exit:{opacity:0,y:-12,height:0},transition:{duration:.25},className:"bg-white border-[1.5px] border-border-strong shadow-brutal-lime p-7 mb-7 brackets-lime relative",children:[e.jsxs("div",{className:"flex items-center justify-between mb-5",children:[e.jsx("h3",{className:"font-display italic font-black text-[24px] uppercase text-navy",children:"Novo time"}),e.jsx("button",{onClick:r,className:"text-fg-mute hover:text-navy font-display italic font-extrabold uppercase text-[12px]",children:"✕ Cancelar"})]}),!n&&e.jsxs("div",{className:"mb-5 bg-[#F5B700]/15 border border-[#F5B700] text-navy p-3.5 flex items-start gap-3 text-[12.5px]",children:[e.jsx(v,{weight:"fill",size:18,className:"shrink-0 mt-0.5"}),e.jsxs("div",{children:[e.jsx("strong",{className:"font-display italic font-extrabold uppercase mr-2",children:"Sem edição ativa"}),"O time será criado, mas precisa de uma edição em andamento pra aparecer na listagem. Crie/abra uma edição em /admin/edicoes primeiro."]})]}),$&&e.jsxs("div",{className:"mb-5 bg-red-500/10 border border-red-500 text-navy p-3.5 flex items-start gap-3 text-[12.5px]",children:[e.jsx(v,{weight:"fill",size:18,className:"shrink-0 mt-0.5 text-red-500"}),e.jsxs("div",{children:[e.jsx("strong",{className:"font-display italic font-extrabold uppercase mr-2",children:"Erro ao criar"}),$.message]})]}),C&&!$&&e.jsxs("div",{className:"mb-5 bg-teal/10 border border-teal text-navy p-3.5 flex items-start gap-3 text-[13px]",children:[e.jsx(M,{weight:"fill",size:18,className:"shrink-0 mt-0.5 text-teal"}),e.jsxs("span",{children:[e.jsx("strong",{className:"font-display italic font-extrabold uppercase mr-2",children:"Sucesso"}),"Time criado e persistido via GraphQL."]})]}),e.jsxs("form",{onSubmit:G,className:"grid grid-cols-2 gap-5",children:[e.jsx(x,{label:"Nome",placeholder:"Olimpo",value:t.name,onChange:s=>{c("name",s),(!t.slug||t.slug===j(t.name))&&c("slug",j(s))}}),e.jsx(x,{label:"Slug",placeholder:"olimpo",hint:"usado em URLs · auto-gerado do nome",value:t.slug,onChange:s=>c("slug",s)}),e.jsx(x,{label:"Cor primária",placeholder:"#0073B7",type:"color",value:t.color,onChange:s=>c("color",s)}),e.jsxs("label",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]",children:"Grupo"}),e.jsxs("select",{value:t.group,onChange:s=>c("group",s.target.value),className:"bg-surface-3 border border-border-strong px-3 py-2.5 text-[13.5px] focus:border-blue focus:outline-none focus:[box-shadow:3px_3px_0_#0A1A3D] transition-all font-medium",children:[e.jsx("option",{value:"A",children:"Grupo A"}),e.jsx("option",{value:"B",children:"Grupo B"}),e.jsx("option",{value:"C",children:"Grupo C"})]})]}),e.jsx(x,{label:"Capitão (IGN)",placeholder:"g1lh",value:t.captainIgn,onChange:s=>c("captainIgn",s)}),e.jsxs("div",{className:"col-span-2 flex items-center gap-3 pt-3 border-t border-border",children:[e.jsx(I,{type:"submit",disabled:i||!t.name||!t.slug,children:i?e.jsxs(e.Fragment,{children:[e.jsx(k,{weight:"bold",size:14,className:"animate-spin"}),"Criando..."]}):e.jsxs(e.Fragment,{children:[e.jsx(S,{weight:"bold",size:14}),"Criar time"]})}),e.jsx(I,{type:"button",variant:"ghost",onClick:r,disabled:i,children:"Cancelar"}),e.jsxs("span",{className:"ml-auto text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.08em]",children:["Endpoint:"," ",e.jsx("code",{className:"text-blue normal-case",children:"createTeam"})]})]})]})]})}function x({label:n,placeholder:r,hint:o,type:t="text",value:p,onChange:l}){return e.jsxs("label",{className:"flex flex-col gap-1.5",children:[e.jsx("span",{className:"text-[10.5px] text-fg-mute font-extrabold uppercase tracking-[0.1em]",children:n}),e.jsx("input",{type:t,placeholder:r,value:p,onChange:m=>l?.(m.target.value),className:H("bg-surface-3 border border-border-strong px-3 py-2.5 text-[13.5px] focus:border-blue focus:outline-none focus:[box-shadow:3px_3px_0_#0A1A3D] transition-all",t==="color"&&"h-11 cursor-pointer p-1")}),o&&e.jsx("span",{className:"text-[10.5px] text-fg-mute",children:o})]})}export{ie as component};
