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
  isAreasLoaded: boolean,
  areas: string[];
  isPositionsLoaded: boolean,
  positions: string[]
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  authToken: undefined,
  user: undefined,
  isUserLoaded: false,
  isBasesLoaded: false,
  bases:[],
  selectBase: undefined,
  isAreasLoaded: undefined,
  areas: [],
  isPositionsLoaded: undefined,
  positions: []
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
        selectBase: undefined,
        isAreasLoaded: undefined,
        areas: [],
        isPositionsLoaded: undefined,
        positions:[]
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
        selectBase: undefined,
        isAreasLoaded: undefined,
        areas: [],
        isPositionsLoaded: false,
        positions: []
      };
    }

    case AuthActionTypes.Logout:
      return initialAuthState;

    case AuthActionTypes.UserLoaded: {
      const user: User = action.payload.user;
      return {
        ...state,
        user,
        isUserLoaded: true
      };
    }

    case AuthActionTypes.UserBasesLoaded: {
      const bases: Base[] = action.payload.bases;
      return {
        ...state,
        bases,
        isBasesLoaded: true
      };
    }

    case AuthActionTypes.UserAreasLoaded: {
      const areas: string[] = action.payload.areas;
      return {
        ...state,
        areas,
        isAreasLoaded: true
      };
    }

    case AuthActionTypes.UserPositionLoaded: {
      const positions: string[] = action.payload.positions;
      return {
        ...state,
        positions,
        isPositionsLoaded: true
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
