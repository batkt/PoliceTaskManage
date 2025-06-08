export interface OfficerRegistrationData {
  workerId: string;
  surname: string;
  givenname: string;
  position: string;
  rank: string;
  branchId: string;
  role: 'user' | 'admin' | 'manager';
  password: string;
  joinedDate: Date;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
}
