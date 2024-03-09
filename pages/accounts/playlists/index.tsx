import {} from 'react';
import { GetServerSideProps, } from 'next';
import NextLink from 'next/link';
import { Button, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';

import { PlayListList, TokenInfo, VideoList, } from '@root/interfaces';
import { getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';


type Props = {
  playListList: PlayListList;
}

const AccountsPlayListsPage = ({}: Props) => {
  return <MainLayout title='재생 목록 | iritube' fullWidth={false}>
    <PageHeaderLayout
      title='재생 목록'
      descriptions={['재생 목록을 조회합니다',]}
    />
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    const playListList: PlayListList = await iritubeAPI.getMyPlayListList(tokenInfo, 0, 20);
    return {
      props: {
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

export default AccountsPlayListsPage;
