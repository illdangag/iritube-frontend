import {} from 'react';
import { GetServerSideProps, } from 'next';
import NextLink from 'next/link';
import { Button, Tab, TabList, TabPanel, TabPanels, Tabs, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';

import { PlayListList, TokenInfo, VideoList, } from '@root/interfaces';
import { getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
};

const AccountsAccountKeyPage = ({}: Props) => {
  return <MainLayout fullWidth={false}>
    <Tabs>
      <TabList>
        <Tab>동영상</Tab>
        <Tab>재생 목록</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>

        </TabPanel>
        <TabPanel>

        </TabPanel>
      </TabPanels>
    </Tabs>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const accountKey: string = context.query.accountKey as string;

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  try {
    // const playListList: PlayListList = await iritubeAPI.getMyPlayListList(tokenInfo, 0, 20);
    return {
      props: {
        // playListList: JSON.parse(JSON.stringify(playListList)),
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
