import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';

import { TokenInfo, Account, } from '../interfaces';
import process from 'process';

const apiKey: string = process.env.apiKey as string;
const backendURL: string = process.env.backendURL as string;

type IricomAPIList = {
  refreshToken: (tokenInfo: TokenInfo) => Promise<TokenInfo>,
  getMyAccount: (tokenInfo: TokenInfo) => Promise<Account>,
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
};

export default IritubeAPI;
