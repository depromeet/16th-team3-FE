export interface AppleAuthorizationResponse {
  code: 'string';
  id_token: 'string';
  state: 'string';
  user: {
    name: { firstName: string; lastName: string };
    email: string;
  };
}
