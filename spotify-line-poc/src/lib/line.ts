// LINE Login OAuth 2.0 工具函式

const LINE_AUTH_URL = "https://access.line.me/oauth2/v2.1/authorize";
const LINE_TOKEN_URL = "https://api.line.me/oauth2/v2.1/token";
const LINE_PROFILE_URL = "https://api.line.me/v2/profile";

interface LineTokenResponse {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in: number;
  scope: string;
  id_token?: string;
}

interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}

// 產生 LINE Login 授權 URL
export function getLineAuthUrl(state: string): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.LINE_CHANNEL_ID!,
    redirect_uri: process.env.LINE_REDIRECT_URI!,
    state,
    scope: "profile openid",
  });

  return `${LINE_AUTH_URL}?${params.toString()}`;
}

// 用 authorization code 換取 token
export async function exchangeLineCode(code: string): Promise<LineTokenResponse> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: process.env.LINE_REDIRECT_URI!,
    client_id: process.env.LINE_CHANNEL_ID!,
    client_secret: process.env.LINE_CHANNEL_SECRET!,
  });

  const response = await fetch(LINE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[LINE] Token exchange failed:", error);
    throw new Error(`LINE token exchange failed: ${response.status}`);
  }

  return response.json();
}

// 取得 LINE 使用者 profile
export async function getLineProfile(accessToken: string): Promise<LineProfile> {
  const response = await fetch(LINE_PROFILE_URL, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("[LINE] Get profile failed:", error);
    throw new Error(`LINE get profile failed: ${response.status}`);
  }

  return response.json();
}

