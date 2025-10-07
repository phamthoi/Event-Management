// src/types.ts
export interface User {
  id: number;
  fullName: string;
  email: string;
}

export interface Registration {
  id: number;
  user: User;
  depositPaid: boolean;
  attended: boolean;
}
