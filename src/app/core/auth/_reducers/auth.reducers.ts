// Actions
import { AuthActions, AuthActionTypes } from '../_actions/auth.actions';
// Models
import { User } from '../_models/user.model';
import { Base } from '../_models/bases.model';

export interface AuthState {
  loggedIn: boolean;
  authToken: string;
  user: User;
  isUserLoaded: boolean;
  isBasesLoaded: boolean;
  bases: Base[];
  selectBase: Base;
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  authToken: undefined,
  user: undefined,
  isUserLoaded: false,
  isBasesLoaded: false,
  bases:[],
  selectBase: undefined
};

export function authReducer(state = initialAuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.Login: {
      const token: string = action.payload.authToken;
      return {
        loggedIn: true,
        authToken: token,
        user: undefined,
        isUserLoaded: false,
        isBasesLoaded: false,
        bases: [],
        selectBase: undefined
      };
    }

    case AuthActionTypes.Register: {
      const token: string = action.payload.authToken;
      return {
        loggedIn: true,
        authToken: token,
        user: undefined,
        isUserLoaded: false,
        isBasesLoaded: false,
        bases:[],
        selectBase: undefined
      };
    }

    case AuthActionTypes.Logout:
      return initialAuthState;

    case AuthActionTypes.UserLoaded: {
      debugger;
      const user: User = action.payload.user;
      return {
        ...state,
        user,
        isUserLoaded: true
      };
    }

    case AuthActionTypes.UserBasesLoaded: {
      debugger;
      const bases: Base[] = action.payload.bases;
      return {
        ...state,
        bases,
        isBasesLoaded: true
      };
    }

    case AuthActionTypes.SelectBase: {
      const selectBase: Base = action.payload.base;
      return{
        ...state,
        selectBase
      };
    }

    default:
      return state;
  }
}
