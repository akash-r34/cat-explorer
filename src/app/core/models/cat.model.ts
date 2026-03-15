export interface CatInfo {
  name: string;
  description: string;
  age: string;
}

export interface Cat {
  id: string;
  info: CatInfo;
}

export type CreateCatPayload = CatInfo;
export type UpdateCatPayload = Partial<CreateCatPayload>;
