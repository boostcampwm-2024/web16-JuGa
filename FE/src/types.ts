export type LoginSuccessResponse = {
  accessToken: string;
};

export type LoginFailResponse = {
  error: string;
  message: string[];
  statusCode: number;
};

export type TiemCategory = 'D' | 'W' | 'M' | 'Y';

export type Padding = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};
