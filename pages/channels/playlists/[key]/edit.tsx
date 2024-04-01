import {} from 'react';
import { GetServerSideProps, } from 'next';
import {} from 'next/router';
import { Button, ButtonGroup, Card, CardBody, CardFooter, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { PlayListEditor, } from '@root/components';

import { PlayList, TokenInfo, } from '@root/interfaces';
import { getTokenInfoByCookies, iritubeAPI, removeTokenInfoByCookies, } from '@root/utils';

type Props = {
  playList: PlayList;
}

const AccountsPlayListEditPage = (props: Props) => {
  const playList: PlayList = props.playList;

  const onChangePlayList = (playList: PlayList) => {
    console.log(playList);
  };

  return <MainLayout fullWidth={false}>
    <PageHeaderLayout
      title='재생 목록 정보 수정'
      descriptions={['재생 목록의 제목, 동영상 목록 순서 등을 수정합니다.',]}
    />
    <Card>
      <CardBody>
        <PlayListEditor playList={playList} onChange={onChangePlayList}/>
      </CardBody>
      <CardFooter paddingTop='0'>
        <ButtonGroup marginLeft='auto'>
          <Button variant='outline'>취소</Button>
          <Button>저장</Button>
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
