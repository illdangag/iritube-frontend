import { useState, useEffect,  } from 'react';
import { GetServerSideProps, } from 'next';
import { Tab, TabList, TabPanel, TabPanels, Tabs, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoListView, } from '@root/components';

import { Account, PlayListList, TokenInfo, Video, VideoList, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  tabIndex: number;
  account: Account;
  videoList: VideoList;
  playListList: PlayListList;
};

const VIDEO_LIMIT: number = 20;

const AccountsAccountKeyPage = (props: Props) => {
  const account: Account = props.account;
  const videoList: VideoList = VideoList.getInstance(props.videoList);
  const playListListProp: PlayListList = PlayListList.getInstance(props.playListList);

  const [page, setPage,] = useState<number>(0);
  const [videos, setVideos,] = useState<Video[]>(videoList.videos);
  const [videoTotal, setVideoTotal,] = useState<number>(videoList.total);

  useEffect(() => {
    if (videos.length < videoTotal) {
      void getNextVideoList(page);
    }
  }, [page,]);

  const onNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const getNextVideoList = async (page: number) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const newVideoListList: VideoList = await iritubeAPI.getVideoList(tokenInfo, account.accountKey, (page + 1) * VIDEO_LIMIT, VIDEO_LIMIT);
    setVideoTotal(newVideoListList.total);
    setVideos(prevState => {
      return [...prevState, ...newVideoListList.videos,];
    });
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
          <VideoListView videos={videos} type='thumbnail' onNextPage={onNextPage}/>
        </TabPanel>
        <TabPanel>
          재생 목록
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
    const playListList: PlayListList = await iritubeAPI.getPlayListList(tokenInfo, accountKey, 0, VIDEO_LIMIT);

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
