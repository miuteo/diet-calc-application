import { IUser } from 'app/entities/user/user.model';

export interface IUserDetails {
  id?: number;
  weight?: number | null;
  proteinNeed?: number | null;
  calProteinNeed?: number | null;
  fatNeed?: number | null;
  calFatNeed?: number | null;
  carbohydrateNeed?: number | null;
  calCarbohydrateNeed?: number | null;
  user?: IUser | null;
}

export class UserDetails implements IUserDetails {
  constructor(
    public id?: number,
    public weight?: number | null,
    public proteinNeed?: number | null,
    public calProteinNeed?: number | null,
    public fatNeed?: number | null,
    public calFatNeed?: number | null,
    public carbohydrateNeed?: number | null,
    public calCarbohydrateNeed?: number | null,
    public user?: IUser | null
  ) {}
}

export function getUserDetailsIdentifier(userDetails: IUserDetails): number | undefined {
  return userDetails.id;
}
