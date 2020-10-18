import { BaseModel } from '../../_base/crud/models/_base.model';
export class Permis extends BaseModel {
    userId= 0;
    basic= false;
    medium= false;
    premium= false;
    sharebalance=false;
    adduser=false;
    bases: number[]
  };