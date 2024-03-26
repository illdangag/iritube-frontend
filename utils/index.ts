import { parseCookies, setCookie, } from 'nookies';
import { TokenInfo, } from '../interfaces';
import { GetServerSidePropsContext, } from 'next/types';
import iritubeAPI from './iritubeAPI';

export { iritubeAPI, };

export class BrowserStorage {
  static TOKEN_INFO_KEY: string = 'tokenInfo';

  static clear (): void {
    setCookie(null, this.TOKEN_INFO_KEY, '', {
      maxAge: 0,
      path: '/',
    });
  }

  static getTokenInfo (): TokenInfo | null {
    const cookies = parseCookies();
    return TokenInfo.getInstance(cookies[this.TOKEN_INFO_KEY]);
  }

  static setTokenInfo (tokenInfo: TokenInfo): void {
    setCookie(null, this.TOKEN_INFO_KEY, JSON.stringify(tokenInfo), {
      maxAge: 30 * 24 * 60 * 60,
      path: '/',
    });
  }
}

export function getTokenExpiredDate (token: string): Date {
  const encodedPayload: string = token.split('.')[1];
  const decodedPayload: string = Buffer.from(encodedPayload, 'base64').toString('utf8');
  const payload: any = JSON.parse(decodedPayload);
  return new Date(payload.exp * 1000);
}

export function getFormattedDateTime (time: number): string {
  const targetDate: Date = new Date(time);
  const year: number = targetDate.getFullYear();
  const month: number = targetDate.getMonth() + 1;
  const date: number = targetDate.getDate();
  let hour: number = targetDate.getHours();
  const minute: number = targetDate.getMinutes();

  return `${year}-${month >= 10 ? month : '0' + month}-${date >= 10 ? date : '0' + date} ${hour >= 10 ? hour : '0' + hour}:${minute}`;
}

export function getTokenInfoByCookies (context: GetServerSidePropsContext): Promise<TokenInfo | null> {
  return new Promise(resolve => {
    let tokenInfo: TokenInfo | null = TokenInfo.getInstance(context.req.cookies.tokenInfo);

    if (tokenInfo !== null) {
      if (tokenInfo.isExpired()) {
        iritubeAPI.refreshToken(tokenInfo)
          .then(newTokenInfo => {
            context.res.setHeader('set-cookie', `${BrowserStorage.TOKEN_INFO_KEY}=${JSON.stringify(newTokenInfo)}; Path=/`);
            resolve(newTokenInfo);
          })
          .catch(() => {
            context.res.setHeader('set-cookie', `${BrowserStorage.TOKEN_INFO_KEY}=; Path=/; Max-Age=0`);
            resolve(null);
          });
      } else {
        resolve(tokenInfo);
      }
    } else {
      resolve(null);
    }
  });
}

export function removeTokenInfoByCookies (context: GetServerSidePropsContext): void {
  context.req.cookies.tokenInfo = null;
}

export function getTokenInfo (): Promise<TokenInfo | null> {
  return new Promise((resolve, reject) => {
    const tokenInfo: TokenInfo | null = BrowserStorage.getTokenInfo();
    if (tokenInfo === null) {
      resolve(null);
    } else if (tokenInfo.expiredDate.getTime() < (new Date()).getTime()) {
      void iritubeAPI.refreshToken(tokenInfo)
        .then(newTokenInfo => {
          BrowserStorage.setTokenInfo(newTokenInfo);
          resolve(newTokenInfo);
        })
        .catch(error => {
          reject(error);
        });
    } else {
      resolve(tokenInfo);
    }
  });
}


