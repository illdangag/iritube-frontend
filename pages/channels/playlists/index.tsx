import { useState, useEffect, } from 'react';
import { GetServerSideProps, } from 'next';
import { Box, Button, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { Pagination, PlayListListView, } from '@root/components';
import { PlayListCreateAlert, } from '@root/components/alerts';

import { PlayListList, TokenInfo, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, iritubeAPI, removeTokenInfoByCookies, } from '@root/utils';

type Props = {
  page: number,
  playListList: PlayListList,
}

const PLAY_LIST_LIMIT: number = 20;

const ChannelsPlayListsPage = (props: Props) => {
  const page: number = props.page;
  const [playListList, setPlayListList,] = useState<PlayListList>(PlayListList.getInstance(props.playListList));
  const [openPlayListCreateAlert, setOpenPlayListCreateAlert,] = useState<boolean>(false);

  useEffect(() => {
    setPlayListList(PlayListList.getInstance(props.playListList));
  }, [props.playListList,]);

  const onClickOpenPlayListCreateAlert = () => {
    setOpenPlayListCreateAlert(true);
  };

  const onClosePlayListCreateAlert = () => {
    setOpenPlayListCreateAlert(false);
  };

  const onConfirmPlayListCreateAlert = async () => {
    const tokenInfo: TokenInfo = await getTokenInfo();
    const playListList: PlayListList = await iritubeAPI.getMyPlayListList(tokenInfo, (page - 1) * PLAY_LIST_LIMIT, PLAY_LIST_LIMIT);
    setPlayListList(playListList);
    setOpenPlayListCreateAlert(false);
  };

  const setPageLink = (page: number) => {
    return '/channels/playlists?page=' + page;
  };

  return <MainLayout title='재생 목록 관리 | iritube' fullWidth={false}>
    <PageHeaderLayout
      title='재생 목록 관리'
      descriptions={['생성한 재생 목록을 조회합니다',]}
      rightContent={<Button size='sm' onClick={onClickOpenPlayListCreateAlert}>재생 목록 생성</Button>}
    />
    <Box paddingBottom='1rem'>
      <PlayListListView
        playLists={playListList.playLists}
        type='detail'
        editable={true}
      />
      <Box paddingBottom='1rem'>
        <Pagination page={0} listResponse={playListList} setPageLink={setPageLink}/>
      </Box>
    </Box>
    <PlayListCreateAlert
      open={openPlayListCreateAlert}
      onClose={onClosePlayListCreateAlert}
      onConfirm={onConfirmPlayListCreateAlert}
    />
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageVariable: string = context.query.page as string;
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  const page: number = pageVariable ? Number.parseInt(pageVariable) : 1;
  if (isNaN(page)) {
    return {
      redirect: {
        permanent: false,
        destination: '/channels/playlists',
      },
    };
  }

  try {
    const playListList: PlayListList = await iritubeAPI.getMyPlayListList(tokenInfo, (page - 1) * PLAY_LIST_LIMIT, PLAY_LIST_LIMIT);
    const total: number = playListList.total;
    const playListsLength: number = playListList.playLists.length;

    if (total > 0 && playListsLength === 0) {
      const lastPage: number = Math.floor(total / PLAY_LIST_LIMIT);

      return {
        redirect: {
          permanent: false,
          destination: '/channels/playlists?page=' + (lastPage < page ? lastPage : page),
        },
      };
    }

    return {
      props: {
        playListList: JSON.parse(JSON.stringify(playListList)),
        page: page,
      },
    };
  } catch {
    removeTokenInfoByCookies(context);
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }
};

export default ChannelsPlayListsPage;
