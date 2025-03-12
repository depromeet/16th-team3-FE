export interface AppleAuthorizationResponse {
  authorization: {
    code: 'string';
    id_token: 'string';
    state?: 'string';
  };
  user?: {
    name: { firstName: string; lastName: string } | null;
    email: string | null;
  };
}
