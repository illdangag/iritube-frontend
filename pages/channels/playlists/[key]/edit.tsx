import { useState, } from 'react';
import { GetServerSideProps, } from 'next';
import NextLink from 'next/link';
import { useRouter, } from 'next/router';
import { Button, ButtonGroup, Card, CardBody, CardFooter, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { PlayListEditor, } from '@root/components';

import { PlayList, TokenInfo, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, iritubeAPI, removeTokenInfoByCookies, } from '@root/utils';

type Props = {
  playList: PlayList;
}

enum State {
  IDLE,
  REQUEST,
}

const AccountsPlayListEditPage = (props: Props) => {
  const playList: PlayList = props.playList;

  const router = useRouter();

  const [state, setState,] = useState<State>(State.IDLE);
  const [editPlayList, setEditPlayList,] = useState<PlayList>(playList);

  const updatePlayList = async () => {
    const tokenInfo: TokenInfo = await getTokenInfo();
    await iritubeAPI.updatePlayList(tokenInfo, editPlayList);
  };

  const onChangePlayList = (playList: PlayList) => {
    setEditPlayList(playList);
  };

  const onClickConfirm = async () => {
    setState(State.REQUEST);
    try {
      void await updatePlayList();
      void router.push('/channels/playlists');
    } catch {
      setState(State.IDLE);
    }
  };

  return <MainLayout fullWidth={false}>
    <PageHeaderLayout
      title='재생 목록 정보 수정'
      descriptions={['재생 목록의 제목, 동영상 목록 순서 등을 수정합니다.',]}
    />
    <Card>
      <CardBody>
        <PlayListEditor playList={editPlayList} onChange={onChangePlayList} isDisabled={state === State.REQUEST}/>
      </CardBody>
      <CardFooter paddingTop='0'>
        <ButtonGroup marginLeft='auto'>
          <Button variant='outline' as={NextLink} href='/channels/playlists' isDisabled={state === State.REQUEST}>취소</Button>
          <Button onClick={onClickConfirm} isLoading={state === State.REQUEST}>저장</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);
  const playListKey: string = context.query.key as string;

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  try {
    const playList: PlayList = await iritubeAPI.getPlayList(tokenInfo, playListKey);
    return {
      props: {
        playList: playList,
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

export default AccountsPlayListEditPage;
