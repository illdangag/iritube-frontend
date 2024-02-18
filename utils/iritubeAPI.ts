import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';

import { Account, TokenInfo, Video, VideoList, } from '../interfaces';
import process from 'process';

const apiKey: string = process.env.apiKey as string;
const backendURL: string = process.env.backendURL as string;

type IricomAPIList = {
  // 인증
  refreshToken: (tokenInfo: TokenInfo) => Promise<TokenInfo>,

  // 계정
  getMyAccount: (tokenInfo: TokenInfo) => Promise<Account>,
  updateMyAccount: (tokenInfo: TokenInfo, nickname: string | null) => Promise<Account>,
  getMyVideoList: (tokenInfo: TokenInfo, offset: number, limit: number) => Promise<VideoList>,

  // 동영상
  uploadVideo: (tokenInfo: TokenInfo, video: Video, file: File) => Promise<Video>,
  getVideo: (tokenInfo: TokenInfo | null, videoKey: string) => Promise<Video>,
  updateVideo: (tokenInfo: TokenInfo, video: Video) => Promise<Video>,
  deleteVideo: (tokenInfo: TokenInfo, videoKey: string) => Promise<Video>,

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
      url: `${backendURL}/v1/infos/accounts`,
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

  updateMyAccount: async (tokenInfo: TokenInfo, nickname: string | null): Promise<Account> => {
    const config: AxiosRequestConfig = {
      url: `${backendURL}/v1/infos/accounts`,
      method: 'PATCH',
      data: {},
    };
    setToken(config, tokenInfo);

    if (nickname !== null) {
      config.data['nickname'] = nickname;
    }

    try {
      const response: AxiosResponse<Account> = await axios.request(config);
      return response.data;
    } catch (error){
      throw error;
    }
  },

  getMyVideoList: async (tokenInfo: TokenInfo, offset: number, limit: number): Promise<VideoList> => {
    const config: AxiosRequestConfig = {
      url: `${backendURL}/v1/infos/accounts/videos`,
      method: 'GET',
      params: {
        offset,
        limit,
      },
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<any> = await axios.request(config);
      return VideoList.getInstance(response.data);
    } catch (error) {
      throw error;
    }
  },

  uploadVideo: async (tokenInfo: TokenInfo, video: Video, file: File): Promise<Video> => {
    const config: AxiosRequestConfig = {
      url: `${backendURL}/v1/videos`,
      method: 'POST',
    };
    setToken(config, tokenInfo);

    const formData: FormData = new FormData();
    formData.append('video', file);
    formData.append('request', JSON.stringify(video));
    config.data = formData;

    try {
      const response: AxiosResponse<Video> = await axios.request(config);
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
      return Video.getInstance(response.data);
    } catch (error) {
      throw error;
    }
  },

  updateVideo: async (tokenInfo: TokenInfo, video: Video): Promise<Video> => {
    const config: AxiosRequestConfig = {
      url: `${backendURL}/v1/videos/${video.videoKey}`,
      method: 'PATCH',
      data: JSON.parse(JSON.stringify(video)),
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Video> = await axios.request(config);
      return Video.getInstance(response.data);
    } catch (error) {
      throw error;
    }
  },

  deleteVideo: async (tokenInfo: TokenInfo, videoKey: string): Promise<Video> => {
    const config: AxiosRequestConfig = {
      url: `${backendURL}/v1/videos/${videoKey}`,
      method: 'DELETE',
    };
    setToken(config, tokenInfo);

    try {
      const response: AxiosResponse<Video> = await axios.request(config);
      return Video.getInstance(response.data);
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
