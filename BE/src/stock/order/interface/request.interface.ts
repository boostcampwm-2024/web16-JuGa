export interface RequestInterface {
  user: {
    id: number;
    email: string;
    password: string;
    tutorial: boolean;
    kakaoId: number;
  };
}
