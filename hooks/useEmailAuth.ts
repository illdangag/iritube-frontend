// react
import { useState, } from 'react';
// etc
import { Account, TokenInfo, } from '../interfaces';
import { FirebaseApp, FirebaseOptions, initializeApp, } from 'firebase/app';
import { Auth, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, UserCredential, } from 'firebase/auth';
// store
import { BrowserStorage, getTokenExpiredDate, } from '@root/utils';
import { useSetRecoilState, } from 'recoil';
import { accountAtom, } from '@root/recoil';
// util
import iritubeAPI from '@root/utils/iritubeAPI';
import { GoogleAuthState, } from '@root/hooks/index';

function useEmailAuth (): [GoogleAuthState, (email: string, password: string) => Promise<void>] {
  const setAccount = useSetRecoilState<Account | null>(accountAtom);
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

  const requestEmailAuth = async (email: string, password: string) => {
    setState(GoogleAuthState.REQUEST);
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const token: string = await userCredential.user.getIdToken();
      const refreshToken: string = userCredential.user.refreshToken;

      const expiredDate: Date = getTokenExpiredDate(token);
      const tokenInfo: TokenInfo = new TokenInfo(token, refreshToken, expiredDate);
      const account: Account = await iritubeAPI.getMyAccount(tokenInfo);

      BrowserStorage.setTokenInfo(tokenInfo);
      setAccount(account);
      setState(GoogleAuthState.SUCCESS);
    } catch (error) {
      console.error(error);
      setState(GoogleAuthState.FAIL);
    }
  };

  return [state, requestEmailAuth,];
}

export default useEmailAuth;
