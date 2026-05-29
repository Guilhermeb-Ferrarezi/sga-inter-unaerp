import{u as r}from"./use-edition-CF9OJSX7.js";import{d as n,g as o}from"./apollo-CiAUcGy4.js";const l=o`
  query Highlights($editionId: UUID!) {
    highlights(editionId: $editionId) {
      id
      cfStreamId
      title
      thumbnailUrl
      publishedAt
    }
  }
`;o`
  query Gallery($editionId: UUID!) {
    gallery(editionId: $editionId) {
      id
      r2Key
      url
      caption
      type
    }
  }
`;function s(t,i){const e=Math.floor((Date.now()-new Date(t.publishedAt).getTime())/864e5);return{id:t.id,title:t.title,category:i%3===0?"Ace":i%3===1?"Clutch":"Play",durationSeconds:30,views:0,publishedDaysAgo:Math.max(0,e),thumbVariant:i%8+1}}function u(t="valorant"){const i=r(t),{data:e,loading:a,error:d}=n(l,{variables:{editionId:i.edition?.id},skip:!i.edition?.id,errorPolicy:"all"});return{highlights:(e?.highlights??[]).map(s),loading:i.loading||a,error:i.error||!!d}}export{u};
