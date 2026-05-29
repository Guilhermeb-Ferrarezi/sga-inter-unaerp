import{d as i,g as n}from"./apollo-aN69TzWM.js";const a=s=>["A","B","C"][s%3];function l(s){const e=s.trim().split(/\s+/);return e.length>=2?(e[0][0]+e[1][0]).toUpperCase():s.length>=2?s.slice(0,2).toUpperCase():s.toUpperCase()}function u(s,e){const o=(s.wins-s.losses)*4;return{id:s.id,slug:s.team.slug,name:s.team.name,shortName:l(s.team.name),color:s.team.primaryColor??"#0073B7",group:a(e),wins:s.wins,losses:s.losses,pointsDiff:o,points:s.wins*3,rosterIds:[],captainIgn:"—"}}function m(s){return s.teams?s.teams.slice().sort((e,o)=>o.wins-e.wins||e.losses-o.losses).map((e,o)=>u(e,o)):[]}const c=n`
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
`;function d(s="valorant"){const{data:e,loading:o,error:t}=i(c,{variables:{gameSlug:s},errorPolicy:"all"}),r=e?.activeEdition??null;return{teams:r?m(r):[],loading:o,error:!!t,edition:r}}export{d as u};
