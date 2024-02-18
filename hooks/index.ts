import useGoogleAuth from './useGoogleAuth';
import useEmailAuth from './useEmailAuth';

enum GoogleAuthState {
  READY,
  REQUEST,
  SUCCESS,
  FAIL,
}

export { GoogleAuthState, useGoogleAuth, useEmailAuth, };
