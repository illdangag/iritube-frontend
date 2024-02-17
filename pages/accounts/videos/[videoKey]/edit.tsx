import { useState, } from 'react';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoEditor, } from '@root/components';

import { TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  video: Video,
}

enum State {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const AccountsVideosEditPage = (props: Props) => {
  const video: Video = Video.getInstance(props.video);
  const router = useRouter();
  const [state, setState,] = useState<State>(State.IDLE);

  const onRequest = async (video: Video) => {
    setState(State.REQUEST);
    const tokenInfo: TokenInfo = await getTokenInfo();
    try {
      await iritubeAPI.updateVideo(tokenInfo, video);
      void router.push('/accounts/videos');
    } catch {
      setState(State.IDLE);
    }
  };

  return <MainLayout>
    <PageHeaderLayout
      title='동영상 정보 수정'
      descriptions={['동영상의 제목, 설명 등을 수정합니다.',]}
    />
    <Card>
      <CardBody>
        <VideoEditor defaultVideo={video} disabled={state === State.REQUEST} onRequest={onRequest}/>
      </CardBody>
    </Card>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);
  const videoKey: string = context.query.videoKey as string;

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  try {
    await iritubeAPI.getMyAccount(tokenInfo);
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
