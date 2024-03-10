import { GetServerSideProps, } from 'next';
import { Tab, TabList, TabPanel, TabPanels, Tabs, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoListView, } from '@root/components';

import { Account, PlayListList, TokenInfo, VideoList, } from '@root/interfaces';
import { getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  accountKey: string;
  tabIndex: number;
  account: Account;
  videoList: VideoList;
  playListList: PlayListList;
};

const AccountsAccountKeyPage = (props: Props) => {
  const account: Account = props.account;
  const videoList: VideoList = VideoList.getInstance(props.videoList);
  const playListList: PlayListList = PlayListList.getInstance(props.playListList);

  console.log(account);

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
          <VideoListView videoList={videoList} type='thumbnail'/>
        </TabPanel>
        <TabPanel>
          재생 목록
        </TabPanel>
      </TabPanels>
    </Tabs>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const unit: number = 20;
  const accountKey: string = context.query.accountKey as string;
  const page: number = context.query.page ? Number(context.query.page) : 1;

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
    const videoList: VideoList = await iritubeAPI.getVideoList(tokenInfo, accountKey, unit * (page - 1), unit);
    const playListList: PlayListList = await iritubeAPI.getPlayListList(tokenInfo, accountKey, 0, unit);

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
