import{u as a}from"./use-edition-CF9OJSX7.js";import{d,g as n}from"./apollo-CiAUcGy4.js";const l=n`
  query Highlights($editionId: UUID!) {
    highlights(editionId: $editionId) {
      id
      cfStreamId
      title
      thumbnailUrl
      publishedAt
    }
  }
`,s=n`
  query Gallery($editionId: UUID!) {
    gallery(editionId: $editionId) {
      id
      r2Key
      url
      caption
      type
    }
  }
`;function g(t,i){const o=Math.floor((Date.now()-new Date(t.publishedAt).getTime())/864e5);return{id:t.id,title:t.title,category:i%3===0?"Ace":i%3===1?"Clutch":"Play",durationSeconds:30,views:0,publishedDaysAgo:Math.max(0,o),thumbVariant:i%8+1}}function c(t="valorant"){const i=a(t),{data:o,loading:e,error:r}=d(l,{variables:{editionId:i.edition?.id},skip:!i.edition?.id,errorPolicy:"all"});return{highlights:(o?.highlights??[]).map(g),loading:i.loading||e,error:i.error||!!r}}function y(t="valorant"){const i=a(t),{data:o,loading:e,error:r}=d(s,{variables:{editionId:i.edition?.id},skip:!i.edition?.id,errorPolicy:"all"});return{photos:o?.gallery??[],loading:i.loading||e,error:i.error||!!r}}export{c as a,y as u};
