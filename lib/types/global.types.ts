export type List<T> = {
  currentPage: number;
  total: number;
  totalPages: number;
  rows: T[];
};

export type CustomResponse<T> = {
  // code is number and greater than 200
  code: number;
  message?: string;
  data: T;
};
