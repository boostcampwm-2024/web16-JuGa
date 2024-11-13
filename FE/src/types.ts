export type LoginSuccessResponse = {
  accessToken: string;
};

export type LoginFailResponse = {
  error: string;
  message: string[];
  statusCode: number;
};

export type TiemCategoty = 'D' | 'W' | 'M' | 'Y';
