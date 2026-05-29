import { gql } from "@apollo/client";

export const GAME_FRAGMENT = gql`
  fragment GameFields on Game {
    id
    slug
    name
    coverUrl
    active
  }
`;

export const TEAM_FRAGMENT = gql`
  fragment TeamFields on Team {
    id
    name
    slug
    logoUrl
    primaryColor
  }
`;

export const EDITION_TEAM_FRAGMENT = gql`
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
  ${TEAM_FRAGMENT}
`;

export const EDITION_FRAGMENT = gql`
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
  ${GAME_FRAGMENT}
`;

export const PLAYER_FRAGMENT = gql`
  fragment PlayerFields on Player {
    id
    sgaUserId
    ign
    avatarUrl
    role
  }
`;

export const MATCH_FRAGMENT = gql`
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
  ${EDITION_TEAM_FRAGMENT}
`;

export const HIGHLIGHT_FRAGMENT = gql`
  fragment HighlightFields on Highlight {
    id
    cfStreamId
    title
    thumbnailUrl
    publishedAt
  }
`;

// ──────────────────────────────────────────────
// QUERIES
// ──────────────────────────────────────────────

export const GET_HOME = gql`
  query GetHome($gameSlug: String!) {
    activeEdition(gameSlug: $gameSlug) {
      ...EditionFields
    }
    games {
      ...GameFields
    }
  }
  ${EDITION_FRAGMENT}
  ${GAME_FRAGMENT}
`;

export const GET_TEAMS_BY_EDITION = gql`
  query GetTeamsByEdition($editionId: UUID!) {
    teams(editionId: $editionId) {
      ...EditionTeamFields
    }
  }
  ${EDITION_TEAM_FRAGMENT}
`;

export const GET_TEAM_BY_SLUG = gql`
  query GetTeamBySlug($slug: String!) {
    team(slug: $slug) {
      ...TeamFields
    }
  }
  ${TEAM_FRAGMENT}
`;

export const GET_STANDINGS = gql`
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
  ${EDITION_TEAM_FRAGMENT}
`;

export const GET_MATCHES = gql`
  query GetMatches($editionId: UUID!, $round: String) {
    matches(editionId: $editionId, round: $round) {
      ...MatchFields
    }
  }
  ${MATCH_FRAGMENT}
`;

export const GET_MATCH = gql`
  query GetMatch($id: UUID!) {
    match(id: $id) {
      ...MatchFields
      edition {
        ...EditionFields
      }
    }
  }
  ${MATCH_FRAGMENT}
  ${EDITION_FRAGMENT}
`;

export const GET_PLAYER = gql`
  query GetPlayer($id: UUID!) {
    player(id: $id) {
      ...PlayerFields
    }
  }
  ${PLAYER_FRAGMENT}
`;

export const GET_HIGHLIGHTS = gql`
  query GetHighlights($editionId: UUID!) {
    highlights(editionId: $editionId) {
      ...HighlightFields
    }
  }
  ${HIGHLIGHT_FRAGMENT}
`;

export const GET_GALLERY = gql`
  query GetGallery($editionId: UUID!) {
    gallery(editionId: $editionId) {
      id
      r2Key
      url
      caption
      type
    }
  }
`;

export const GET_EDITIONS = gql`
  query GetEditions($gameSlug: String!) {
    editions(gameSlug: $gameSlug) {
      ...EditionFields
    }
  }
  ${EDITION_FRAGMENT}
`;

// ──────────────────────────────────────────────
// MUTATIONS (admin)
// ──────────────────────────────────────────────

export const CREATE_TEAM = gql`
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
  ${TEAM_FRAGMENT}
`;

export const ADD_TEAM_TO_EDITION = gql`
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
  ${TEAM_FRAGMENT}
`;

export const CREATE_PLAYER = gql`
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
  ${PLAYER_FRAGMENT}
`;

export const CREATE_MATCH = gql`
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
  ${MATCH_FRAGMENT}
`;

export const RECORD_RESULT = gql`
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
`;

export const UPLOAD_PRESIGNED = gql`
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
`;

export const CONFIRM_MEDIA = gql`
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
`;

export const CREATE_HIGHLIGHT = gql`
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
  ${HIGHLIGHT_FRAGMENT}
`;

export const IMPORT_EDITION = gql`
  mutation ImportEdition($payload: String!) {
    importEdition(payload: $payload)
  }
`;
