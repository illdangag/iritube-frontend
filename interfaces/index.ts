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

export abstract class ListResponse {
  public total: number;
  public offset: number;
  public limit: number;

  public get currentPage (): number {
    return (this.offset / this.limit) + 1;
  }

  public get totalPage (): number {
    return Math.ceil(this.total / this.limit);
  }

  public getPaginationList (maxSize: number): number[] {
    const leftPadding: number = Math.floor((maxSize - 1) / 2);
    const rightPadding: number = Math.ceil((maxSize - 1) / 2);

    let startPage: number = this.currentPage - leftPadding;
    let endPage: number = this.currentPage + rightPadding;

    if (startPage < 1) {
      endPage += startPage * -1 + 1;
    }

    if (this.totalPage - endPage < 0) {
      startPage += (this.totalPage - endPage);
    }

    if (startPage < 1) {
      startPage = 1;
    }

    endPage = Math.min(endPage, this.totalPage);

    const resultList: number[] = [];
    for (let index = startPage; index <= endPage; index++) {
      resultList.push(index);
    }

    return resultList;
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
  public account: Account;
  public title: string;
  public description: string;
  public createDate: number;
  public duration: number;
  public state: VideoState;
  public share: VideoShare;
  public tags: string[];
  public viewCount: number;

  public get hlsPath (): string {
    const backend: string = process.env.backendURL;
    return `${backend}/v1/stream/${this.videoKey}/master.m3u8`;
  }

  public static getInstance (object: any): Video {
    return Object.assign(new Video(), object);
  }
}

export class VideoList extends ListResponse {
  public videos: Video[];

  public static getInstance (object: any): VideoList {
    object.videos = object.videos.map(item => Video.getInstance(item));
    return Object.assign(new VideoList(), object);
  }
}
