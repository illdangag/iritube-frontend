import { useState, useEffect,  } from 'react';
import { GetServerSideProps, } from 'next';
import { Tab, TabList, TabPanel, TabPanels, Tabs, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoListView, PlayListListView, } from '@root/components';

import { Account, PlayList, PlayListList, TokenInfo, Video, VideoList, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  tabIndex: number;
  account: Account;
  videoList: VideoList;
  playListList: PlayListList;
};

type VideoListInfo = {
  videos: Video[];
  page: number;
  total: number;
  nextPage: number;
}

type PlayListInfo = {
  playLists: PlayList[];
  page: number;
  total: number;
  nextPage: number;
}

const VIDEO_LIMIT: number = 20;
const PLAYLIST_LIMIT: number = 20;

const AccountsAccountKeyPage = (props: Props) => {
  const account: Account = props.account;
  const videoList: VideoList = VideoList.getInstance(props.videoList);
  const playListList: PlayListList = PlayListList.getInstance(props.playListList);

  const [videoListInfo, setVideoListInfo,] = useState<VideoListInfo>({
    videos: videoList.videos,
    page: 0,
    total: videoList.videos.length,
    nextPage: 0,
  } as VideoListInfo);

  const [playListListInfo, setPlayListListInfo,] = useState<PlayListInfo>({
    playLists: playListList.playLists,
    page: 0,
    total: playListList.total,
    nextPage: 0,
  } as PlayListInfo);

  useEffect(() => {
    if (videoListInfo.page !== videoListInfo.nextPage) {
      void getNextVideoList(videoListInfo.nextPage);
    }
  }, [videoListInfo,]);

  const onVideosNextPage = () => {
    setVideoListInfo((prev) => {
      return {
        ...prev,
        nextPage: prev.page + 1,
      } as VideoListInfo;
    });
  };

  const getNextVideoList = async (page: number) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const newVideoListList: VideoList = await iritubeAPI.getVideoList(tokenInfo, account.accountKey, (page) * VIDEO_LIMIT, VIDEO_LIMIT);
    if (newVideoListList.videos.length > 0) {
      setVideoListInfo((prev) => {
        return {
          ...prev,
          page,
          videos: [...prev.videos, ...newVideoListList.videos,],
          total: newVideoListList.total,
        } as VideoListInfo;
      });
    } else {
      setVideoListInfo((prev) => {
        return {
          ...prev,
          nextPage: prev.page,
        };
      });
    }
  };

  useEffect(() => {
    if (playListListInfo.page !== playListListInfo.nextPage) {
      void getNextPlayListList(playListListInfo.nextPage);
    }
  }, [playListListInfo,]);

  const onPlayListsNextPage = () => {
    setPlayListListInfo((prev) => {
      return {
        ...prev,
        nextPage: prev.nextPage + 1,
      } as PlayListInfo;
    });
  };

  const getNextPlayListList = async (page: number) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const newPlayListList: PlayListList = await iritubeAPI.getPlayListList(tokenInfo, account.accountKey, (page) * PLAYLIST_LIMIT, PLAYLIST_LIMIT);
    if (newPlayListList.playLists.length > 0) {
      setPlayListListInfo((prev) => {
        return {
          ...prev,
          page,
          playLists: [...prev.playLists, ...newPlayListList.playLists,],
          total: newPlayListList.total,
        } as PlayListInfo;
      });
    } else {
      setPlayListListInfo((prev) => {
        return {
          ...prev,
          nextPage: prev.page,
        } as PlayListInfo;
      });
    }
  };

  return <MainLayout title='동영상 목록 | iritube' fullWidth={false}>
    <PageHeaderLayout
      title={account.nickname}
    />
    <Tabs>
      <TabList>
        <Tab>동영상</Tab>
        <Tab>재생 목록</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <VideoListView videos={videoListInfo.videos} type='thumbnail' onNextPage={onVideosNextPage}/>
        </TabPanel>
        <TabPanel>
          <PlayListListView playLists={playListListInfo.playLists} onNextPage={onPlayListsNextPage}/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accountKey: string = context.query.accountKey as string;
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  try {
    const account: Account = await iritubeAPI.getAccount(tokenInfo, accountKey);
    const videoList: VideoList = await iritubeAPI.getVideoList(tokenInfo, accountKey, 0, VIDEO_LIMIT);
    const playListList: PlayListList = await iritubeAPI.getPlayListList(tokenInfo, accountKey, 0, PLAYLIST_LIMIT);

    return {
      props: {
        accountKey,
        account,
        videoList: JSON.parse(JSON.stringify(videoList)),
        playListList: JSON.parse(JSON.stringify(playListList)),
      },
    };
  } catch (error) {
    removeTokenInfoByCookies(context);
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }
};

export default AccountsAccountKeyPage;
