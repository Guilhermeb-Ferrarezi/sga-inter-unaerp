import{d as e,g as o}from"./apollo-aN69TzWM.js";const i=o`
  query Editions($gameSlug: String!) {
    editions(gameSlug: $gameSlug) {
      id
      year
      name
      status
      startedAt
      endedAt
      game {
        slug
      }
    }
  }
`;function r(t){const a=t.status==="ongoing"?"ongoing":t.status==="finished"?"finished":"draft";return{year:t.year,game:t.game.slug,name:t.name,status:a,teamsCount:0,matchesCount:0,photosCount:0}}function g(t="valorant"){const{data:a,loading:n,error:s}=e(i,{variables:{gameSlug:t},errorPolicy:"all"});return{editions:(a?.editions??[]).map(r),loading:n,error:!!s}}export{g as u};
