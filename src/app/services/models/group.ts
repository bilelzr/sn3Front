import {Application} from "./application";

export interface Group {
  groupName?: string;
  uuid?: string;
  creationDate?: Date;
  applications?: Application[];
}
