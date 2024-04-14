import { useState, } from 'react';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import { Button, ButtonGroup, Card, CardBody, CardFooter, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoEditor, } from '@root/components';

import { TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, iritubeAPI, } from '@root/utils';
import NextLink from 'next/link';

type Props = {
  video: Video,
}

enum State {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const AccountsVideosEditPage = (props: Props) => {
  const router = useRouter();
  const [video, setVideo,] = useState<Video>(Video.getInstance(props.video));
  const [state, setState,] = useState<State>(State.IDLE);

  const onChangeVideoEditor = async (video: Video) => {
    setVideo(video);
  };

  const onClickConfirm = async () => {
    setState(State.REQUEST);
    try {
      const tokenInfo: TokenInfo = await getTokenInfo();
      await iritubeAPI.updateVideo(tokenInfo, video);
      void router.push('/channels/videos');
    } catch {
      setState(State.IDLE);
    }
  };

  return <MainLayout fullWidth={false}>
    <PageHeaderLayout
      title='동영상 정보 수정'
      descriptions={['동영상의 제목, 설명 등을 수정합니다.',]}
    />
    <Card>
      <CardBody>
        <VideoEditor video={video} mode='edit' isDisabled={state === State.REQUEST} onChange={onChangeVideoEditor}/>
      </CardBody>
      <CardFooter paddingTop='0'>
        <ButtonGroup marginLeft='auto'>
          <Button variant='outline' as={NextLink} href='/channels/videos' isDisabled={state === State.REQUEST}>취소</Button>
          <Button onClick={onClickConfirm} isLoading={state === State.REQUEST}>수정</Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);
  const videoKey: string = context.query.key as string;

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  try {
    const video: Video = await iritubeAPI.getVideo(tokenInfo, videoKey);
    return {
      props: {
        video: JSON.parse(JSON.stringify(video)),
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

export default AccountsVideosEditPage;
