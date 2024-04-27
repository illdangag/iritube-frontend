import { AxiosError, } from 'axios';

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

export type VideoViewType = 'thumbnail' | 'detail';

export type PlayListViewType = 'thumbnail' | 'detail';

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

export enum IritubeErrorCode {
  DUPLICATE_VIDEO_IN_PLAYLIST = '05000001',
  UNKNOWN_ERROR = '99999999',
}

export class IritubeError extends Error {
  private _httpState: number;
  private _code: IritubeErrorCode;
  private _message: string;

  constructor (axiosError: AxiosError) {
    const code: string = axiosError.response.data['code'] as string;
    const message: string = axiosError.response.data['message'] as string;
    const httpState: number = axiosError.response.status;

    super(message);

    this._code = code as IritubeErrorCode;
    this._message = message;
    this._httpState = httpState;
  }

  get httpState () {
    return this._httpState;
  }

  get code () {
    return this._code;
  }

  get message () {
    return this._message;
  }
}

export enum AccountAuth {
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
  ACCOUNT = 'ACCOUNT',
}

export type Account = {
  id: string;
  nickname: string;
  auth: AccountAuth;
  accountKey: string;
}

export enum VideoState {
  EMPTY = 'EMPTY',
  UPLOADED = 'UPLOADED',
  CONVERTING = 'CONVERTING',
  CONVERTED = 'CONVERTED',
  FAIL_CONVERT = 'FAIL_CONVERT',
}

export enum VideoShare {
  PUBLIC = 'PUBLIC',
  URL = 'URL',
  PRIVATE = 'PRIVATE',
}

export enum PlayListShare {
  PUBLIC = 'PUBLIC',
  URL = 'URL',
  PRIVATE = 'PRIVATE',
}

export class Video {
  public id: string = '';
  public videoKey: string = '';
  public account: Account;
  public title: string = '';
  public description: string = '';
  public createDate: number = 0;
  public duration: number = 0;
  public state: VideoState;
  public share: VideoShare;
  public tags: string[] = [];
  public viewCount: number = 0;
  public deleted: boolean = false;

  public get hlsPath (): string {
    const backend: string = process.env.backendURL;
    return `${backend}/v1/stream/${this.videoKey}/master.m3u8`;
  }

  public static getInstance (object: any): Video {
    return Object.assign(new Video(), object);
  }

  public getUpdateDate (): string {
    const now: number = new Date().getTime();

    let ago: number = (this.createDate - now) / 1000;
    let unit: Intl.RelativeTimeFormatUnit;

    if ((ago * -1) < 60) {
      return '조금 전';
    } else if ((ago * -1) < 60 * 60) {
      ago = ago / (60);
      unit = 'minute';
    } else if ((ago * -1) < 60 * 60 * 24) {
      ago = ago / (60 * 60);
      unit = 'hour';
    } else if ((ago * -1) < 60 * 60 * 24 * 30) {
      ago = ago / (60 * 60 * 24);
      unit = 'day';
    } else if ((ago * -1) < 60 * 60 * 24 * 30 * 12) {
      ago = ago / (60 * 60 * 24 * 30);
      unit = 'month';
    } else { // 몇개월 전
      ago = ago / (60 * 60 * 24 * 30 * 12);
      unit = 'year';
    }

    return new Intl.RelativeTimeFormat('ko-KR').format(Math.round(ago), unit);
  }

  public getViewCount (): string {
    return new Intl.NumberFormat('ko-KR', {
      notation: 'compact',
    }).format(this.viewCount)  + '회';
  }

  public getDurationText (): string {
    let duration: number = Math.floor(this.duration);

    const hour: number = Math.floor(duration / 3600);
    const minute: number = Math.floor((duration - hour * 3600) / 60);
    const second: number = Math.floor((duration - hour * 3600 - minute * 60));

    let result: string = '';

    if (hour > 0) {
      result = hour + ':';
    }

    return result + String(minute).padStart(2, '0') + ':' + String(second).padStart(2, '0');
  }

  public getTitle (): string {
    if (this.id) {
      return this.title;
    }

    if (this.share === VideoShare.PRIVATE) {
      return '비공개 동영상';
    }

    return '삭제된 동영상';
  }
}

export class VideoList extends ListResponse {
  public videos: Video[];

  public static getInstance (object: any): VideoList {
    object.videos = object.videos.map(item => Video.getInstance(item));
    return Object.assign(new VideoList(), object);
  }
}

export class PlayList {
  public id: string;
  public playListKey: string;
  public title: string;
  public videos: Video[];
  public account: Account;
  public share: PlayListShare;

  public static getInstance (object: any): PlayList {
    object.videos = object.videos.map(video => Video.getInstance(video));
    return Object.assign(new PlayList(), object);
  }
}

export class PlayListList extends ListResponse {
  public playLists: PlayList[];

  public static getInstance (object: any): PlayListList {
    object.playLists = object.playLists.map(playList => {
      playList.videos = playList.videos.map(video => Video.getInstance(video));
      return PlayList.getInstance(playList);
    });
    return Object.assign(new PlayListList(), object);
  }
}

export class VideoComment {
  public id: string;
  public videoCommentKey: string;
  public createDate: number;
  public updateDate: number;
  public comment: string = '';
  public account: Account;

  public static getInstance (object: any): VideoComment {
    return Object.assign(new VideoComment(), object);
  }

  public getUpdateDate (): string {
    const now: number = new Date().getTime();

    let ago: number = (this.updateDate - now) / 1000;
    let unit: Intl.RelativeTimeFormatUnit;

    if ((ago * -1) < 60) {
      return '조금 전';
    } else if ((ago * -1) < 60 * 60) {
      ago = ago / (60);
      unit = 'minute';
    } else if ((ago * -1) < 60 * 60 * 24) {
      ago = ago / (60 * 60);
      unit = 'hour';
    } else if ((ago * -1) < 60 * 60 * 24 * 30) {
      ago = ago / (60 * 60 * 24);
      unit = 'day';
    } else if ((ago * -1) < 60 * 60 * 24 * 30 * 12) {
      ago = ago / (60 * 60 * 24 * 30);
      unit = 'month';
    } else { // 몇개월 전
      ago = ago / (60 * 60 * 24 * 30 * 12);
      unit = 'year';
    }

    return new Intl.RelativeTimeFormat('ko-KR').format(Math.round(ago), unit);
  }
}

export class VideoCommentList extends ListResponse {
  public comments: VideoComment[];

  public static getInstance (object: any): VideoCommentList {
    object.comments = object.comments.map(videoComment => {
      return VideoComment.getInstance(videoComment);
    });

    return Object.assign(new VideoCommentList(), object);
  }
}
