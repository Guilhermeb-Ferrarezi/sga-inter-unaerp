const SGA_AUTH_BASE =
  import.meta.env.VITE_SGA_AUTH_URL ?? "https://auth.santos-games.com";

export function buildSgaAuthUrl(): string {
  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://santos-games.com";
  const basePath = import.meta.env.BASE_URL || "/";
  const redirectUri = `${origin}${basePath}auth/callback`
    .replace(/\/+/g, "/")
    .replace(":/", "://");
  const params = new URLSearchParams({
    client_id: "inter-unaerp",
    redirect_uri: redirectUri,
  });
  return `${SGA_AUTH_BASE}?${params.toString()}`;
}

export function redirectToSgaAuth(): void {
  if (typeof window !== "undefined") {
    window.location.href = buildSgaAuthUrl();
  }
}
