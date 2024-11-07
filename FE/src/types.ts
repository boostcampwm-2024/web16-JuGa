export type LoginSuccessResponse = {
  accessToken: string;
};

export type LoginFailResponse = {
  error: string;
  message: string[];
  statusCode: number;
};
