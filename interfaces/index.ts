export class TokenInfo {
  public token: string;
  public refreshToken: string;
  public expiredDate: Date;

  constructor (token: string, refreshToken: string, expiredDate: Date) {
    this.token = token;
    this.refreshToken = refreshToken;
    this.expiredDate = expiredDate;
  }

  static getInstance (data: any): TokenInfo | null {
    let dataObject: any | null = null;

    if (data === undefined || data === null || data === '') {
      return null;
    } else if (typeof data === 'string') {
      try {
        dataObject = JSON.parse(data);
      } catch (error) {
        return null;
      }
    }

    if (dataObject && dataObject.hasOwnProperty('token') && dataObject.hasOwnProperty('refreshToken') && dataObject.hasOwnProperty('expiredDate')) {
      return new TokenInfo(dataObject.token, dataObject.refreshToken, new Date(dataObject.expiredDate));
    } else {
      return null;
    }
  }

  public isExpired (): boolean {
    return this.expiredDate.getTime() < (new Date()).getTime();
  }
}

export enum AccountAuth {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  ACCOUNT = 'ACCOUNT',
}

export type Account = {
  id: string,
  nickname: string,
  auth: AccountAuth,
}

export enum VideoState {
  ENABLED = 'ENABLED',
}

export enum VideoShare {
  PUBLIC = 'PUBLIC',
  URL = 'URL',
  PRIVATE = 'PRIVATE',
}

export class Video {
  public id: string;
  public videoKey: string;
  public title: string;
  public description: string;
  public duration: number;
  public state: VideoState;
  public share: VideoShare;
  public tags: string[];

  public get hlsPath (): string {
    const backend: string = process.env.backendURL;
    return `${backend}/v1/stream/${this.videoKey}/master.m3u8`;
  }
}
