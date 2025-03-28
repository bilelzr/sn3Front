import {UserRole} from "./UserRole";

export interface User {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  role?: UserRole ;
  accountNonLocked?: boolean;
  uuid?: string;
  DateOfJoining?: Date;
  imagePath?: string;

}
