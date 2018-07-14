import { UserViewModel } from '../view-models/user.view-model';

export interface LoginResponse {
  data:  {
    token: string
  }
}