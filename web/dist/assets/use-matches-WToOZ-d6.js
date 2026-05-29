import{u as a}from"./use-edition-CF9OJSX7.js";import{d as u,g as n}from"./apollo-CiAUcGy4.js";const o=n`
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
`,d=e=>{const t=e.toLowerCase();return t.includes("grupo a")?"A":t.includes("grupo b")?"B":t.includes("grupo c")?"C":t.includes("quart")?"Quartas":t.includes("semi")?"Semi":t.includes("final")?"Final":"A"};function l(e){const t=e.status==="live"?"live":e.status==="done"?"done":"scheduled";return{id:e.id,teamA:e.teamA.team.slug,teamB:e.teamB.team.slug,scheduledAt:e.scheduledAt??new Date().toISOString(),status:t,round:e.round,group:d(e.round),result:e.result?{winnerSlug:e.result.winner.team.slug,scoreA:e.result.scoreA,scoreB:e.result.scoreB,map:e.result.map??"",playedAt:e.result.playedAt}:void 0}}function p(e="valorant"){const t=a(e),{data:s,loading:r,error:i}=u(o,{variables:{editionId:t.edition?.id},skip:!t.edition?.id,errorPolicy:"all"});return{matches:(s?.matches??[]).map(l),teams:t.teams,loading:t.loading||r,error:t.error||!!i}}const g=e=>e.status==="live",A=e=>e.status==="scheduled",f=e=>e.status==="done";export{g as a,A as b,f as i,p as u};
