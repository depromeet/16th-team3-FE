export interface AppleAuthorizationResponse {
  code: 'string';
  idToken: 'string';
  state?: 'string';
  user?: {
    name: { firstName: string; lastName: string } | null;
    email: string | null;
  };
}
