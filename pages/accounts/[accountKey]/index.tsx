import { GetServerSideProps, } from 'next';
import { Tab, TabList, TabPanel, TabPanels, Tabs, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { PlayListListView, VideoListScrollView, } from '@root/components';

import { Account, TokenInfo, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  account: Account;
};

const AccountsAccountKeyPage = (props: Props) => {
  const account: Account = props.account;

  const onPlayListsNextPage = async (offset: number, limit: number) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    return await iritubeAPI.getPlayListList(tokenInfo, account.accountKey, offset, limit);
  };

  const onVideoListNextPage = async (offset: number, limit: number) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    return await iritubeAPI.getVideoList(tokenInfo, account.accountKey, offset, limit);
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
          <VideoListScrollView
            type='thumbnail'
            onNextPage={onVideoListNextPage}
          />
        </TabPanel>
        <TabPanel>
          <PlayListListView onNextPage={onPlayListsNextPage}/>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accountKey: string = context.query.accountKey as string;
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  try {
    const account: Account = await iritubeAPI.getAccount(tokenInfo, accountKey);

    return {
      props: {
        accountKey,
        account,
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
