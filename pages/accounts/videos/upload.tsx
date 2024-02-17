import { useState, } from 'react';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import { Card, CardBody, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoEditor, } from '@root/components';

import { TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

enum State {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const VideoUploadPage = () => {
  const router = useRouter();
  const [state, setState,] = useState<State>(State.IDLE);

  const onRequest = async (video: Video, file: File) => {
    setState(State.REQUEST);
    try {
      const tokenInfo: TokenInfo = await getTokenInfo();
      await iritubeAPI.uploadVideo(tokenInfo, file, video.title, video.description);
      void router.push('/');
    } catch {
      setState(State.IDLE);
    }
  };

  return <MainLayout title='동영상 업로드 | iritube' fullWidth={false}>
    <PageHeaderLayout
      title='동영상 업로드'
      descriptions={['새로운 동영상을 업로드합니다',]}
    />
    <Card>
      <CardBody>
        <VideoEditor disabled={state === State.REQUEST} onRequest={onRequest}/>
      </CardBody>
    </Card>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent('/videos/upload'),
      },
    };
  }

  try {
    await iritubeAPI.getMyAccount(tokenInfo);
    return {
      props: {},
    };
  } catch {
    removeTokenInfoByCookies(context);
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent('/videos/upload'),
      },
    };
  }
};

export default VideoUploadPage;
