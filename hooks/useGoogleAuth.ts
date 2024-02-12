// react
import { useState, } from 'react';
// etc
import { Account, TokenInfo, } from '../interfaces';
import { FirebaseApp, FirebaseOptions, initializeApp, } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithPopup, UserCredential, } from 'firebase/auth';
// store
import { BrowserStorage, getTokenExpiredDate, } from '@root/utils';
import { useSetRecoilState, } from 'recoil';
import { accountAtom, } from '@root/recoil';
// util
import iritubeAPI from '@root/utils/iritubeAPI';

export enum GoogleAuthState {
  READY,
  REQUEST,
  SUCCESS,
  FAIL,
}

function useGoogleAuth (): [GoogleAuthState, () => Promise<void>] {
  const setMyAccount = useSetRecoilState<Account | null>(accountAtom);
  const [state, setState,] = useState<GoogleAuthState>(GoogleAuthState.READY);

  const projectId: string = process.env.projectId as string;
  const apiKey: string = process.env.apiKey as string;
  const authDomain: string = process.env.authDomain as string;

  const firebaseOptions: FirebaseOptions = {
    projectId: projectId,
    apiKey: apiKey,
    authDomain: authDomain,
  };

  const firebaseApp: FirebaseApp = initializeApp(firebaseOptions);
  const auth: Auth = getAuth(firebaseApp);
  const googleAuthProvider = new GoogleAuthProvider();
  googleAuthProvider.setDefaultLanguage('ko');
  googleAuthProvider.setCustomParameters({
    login_hint: 'user@example.com',
  });

  const requestGoogleAuth = async () => {
    setState(GoogleAuthState.REQUEST);
    try {
      const userCredential: UserCredential = await signInWithPopup(auth, googleAuthProvider);
      const token: string = await userCredential.user.getIdToken();
      const refreshToken: string = userCredential.user.refreshToken;
      const expiredDate: Date = getTokenExpiredDate(token);
      const tokenInfo: TokenInfo = new TokenInfo(token, refreshToken, expiredDate);
      const account: Account = await iritubeAPI.getMyAccount(tokenInfo);

      BrowserStorage.setTokenInfo(tokenInfo);
      setMyAccount(account);
      setState(GoogleAuthState.SUCCESS);
    } catch (error) {
      console.error(error);
      setState(GoogleAuthState.FAIL);
    }
  };

  return [state, requestGoogleAuth,];
}

export default useGoogleAuth;
