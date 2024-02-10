import axios, { Axios, AxiosRequestConfig, AxiosResponse, } from 'axios';

import { TokenInfo, Account, Video, VideoList, } from '../interfaces';
import process from 'process';

const apiKey: string = process.env.apiKey as string;
const backendURL: string = process.env.backendURL as string;

type IricomAPIList = {
  // 인증
  refreshToken: (tokenInfo: TokenInfo) => Promise<TokenInfo>,

  // 계정
  getMyAccount: (tokenInfo: TokenInfo) => Promise<Account>,

  // 동영상
  getVideo: (tokenInfo: TokenInfo | null, videoKey: string) => Promise<Video>,
  getRecommendVideoList: (tokenInfo: TokenInfo | null, offset: number, limit: number) => Promise<VideoList>,
};

function setToken (config: AxiosRequestConfig, tokenInfo: TokenInfo | null) {
  if (tokenInfo !== null) {
    config.headers = {
      ...config.headers,
      Authorization: 'Bearer ' + tokenInfo.token,
    };
  }
}

const IritubeAPI: IricomAPIList = {
  refreshToken: async (tokenInfo: TokenInfo): Promise<TokenInfo> => {
    const config: AxiosRequestConfig = {
      url: 'https://securetoken.googleapis.com/v1/token',
      method: 'POST',
      params: {
        key: apiKey,
      },
      data: {
        grant_type: 'refresh_token',
        refresh_token: tokenInfo.refreshToken,
      },
    };

    try {
      const response: AxiosResponse<any> = await axios.request(config);
      const token: string = response.data.id_token;
      const refreshToken: string = response.data.refresh_token;
      const expiredDate: Date = new Date((new Date()).getTime() + (Number(response.data.expires_in) * 1000));
      return new TokenInfo(token, refreshToken, expiredDate);
    } catch (error) {
      throw error;
    }
  },

  getMyAccount: async (tokenInfo: TokenInfo): Promise<Account> => {
    const config: AxiosRequestConfig = {
      url: `${backendURL}/v1/infos/account`,
      method: 'GET',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Account> = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getVideo: async (tokenInfo: TokenInfo | null, videoKey: string): Promise<Video> => {
    const config: AxiosRequestConfig = {
      url: `${backendURL}/v1/videos/${videoKey}`,
      method: 'GET',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Video> = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getRecommendVideoList: async (tokenInfo: TokenInfo | null, offset: number, limit: number): Promise<VideoList> => {
    const config: AxiosRequestConfig = {
      url: `${backendURL}/v1/recommend/videos`,
      method: 'GET',
      params: {
        offset,
        limit,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<any> = await axios.request(config);
      const videos: Video[] = response.data.videos.map(item => Object.assign(new Video(), item));
      const videoList: VideoList = Object.assign(new VideoList(), response.data);
      videoList.videos = videos;
      return videoList;
    } catch (error) {
      throw error;
    }
  },
};

export default IritubeAPI;
