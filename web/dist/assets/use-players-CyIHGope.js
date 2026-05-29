import{u as o}from"./use-edition-NPEhu2j8.js";import{g as r}from"./apollo-aN69TzWM.js";r`
  query Roster($editionTeamId: UUID!) {
    teams(editionId: "") {
      id
    }
  }
`;r`
  query Player($id: UUID!) {
    player(id: $id) {
      id
      sgaUserId
      ign
      avatarUrl
      role
    }
  }
`;function s(e="valorant"){const{loading:i,error:a}=o(e);return{players:[],loading:i,error:a}}export{s as u};
