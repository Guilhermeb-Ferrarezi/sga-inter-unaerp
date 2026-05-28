import{r as n}from"./index-BFhAGpgv.js";import{d as o,g as l}from"./apollo-CiAUcGy4.js";const u=s=>["A","B","C"][s%3];function m(s){const e=s.trim().split(/\s+/);return e.length>=2?(e[0][0]+e[1][0]).toUpperCase():s.length>=2?s.slice(0,2).toUpperCase():s.toUpperCase()}function g(s,e){const t=(s.wins-s.losses)*4;return{id:s.id,slug:s.team.slug,name:s.team.name,shortName:m(s.team.name),color:s.team.primaryColor??"#0073B7",group:u(e),wins:s.wins,losses:s.losses,pointsDiff:t,points:s.wins*3,rosterIds:[],captainIgn:"—"}}function c(s){return s.teams?s.teams.slice().sort((e,t)=>t.wins-e.wins||e.losses-t.losses).map((e,t)=>g(e,t)):[]}const d=l`
  query ActiveEdition($gameSlug: String!) {
    activeEdition(gameSlug: $gameSlug) {
      id
      year
      name
      status
      startedAt
      endedAt
      teams {
        id
        wins
        losses
        finalPlacement
        team {
          id
          name
          slug
          primaryColor
          logoUrl
        }
      }
    }
  }
`;function E(s="valorant"){const{data:e,loading:t,error:r}=o(d,{variables:{gameSlug:s},errorPolicy:"all"});if(t&&!e)return{teams:[],loading:!0,usingFallback:!1,edition:null};if(r||!e?.activeEdition)return{teams:n,loading:!1,usingFallback:!0,edition:null};const i=e.activeEdition,a=c(i);return a.length===0?{teams:n,loading:!1,usingFallback:!0,edition:i}:{teams:a,loading:!1,usingFallback:!1,edition:i}}export{E as u};
