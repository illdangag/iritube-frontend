import { useState, } from 'react';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import { Button, ButtonGroup, Card, CardBody, CardFooter, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoEditor, } from '@root/components';

import { TokenInfo, Video, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, iritubeAPI, } from '@root/utils';
import NextLink from 'next/link';

enum State {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const VideoUploadPage = () => {
  const router = useRouter();
  const [video, setVideo,] = useState<Video>(new Video());
  const [file, setFile,] = useState<File | null>(null);
  const [state, setState,] = useState<State>(State.IDLE);

  const onChangeVideoEditor = (video: Video, file: File) => {
    setVideo(video);
    setFile(file);
  };

  const onClickConfirm = async () => {
    setState(State.REQUEST);
    try {
      const tokenInfo: TokenInfo = await getTokenInfo();
      await iritubeAPI.uploadVideo(tokenInfo, video, file);
      void router.push('/channels/videos');
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
        <VideoEditor
          video={video}
          isLoading={state === State.REQUEST}
          onChange={onChangeVideoEditor}
        />
      </CardBody>
      <CardFooter paddingTop='0'>
        <ButtonGroup marginLeft='auto'>
          <Button variant='outline' as={NextLink} href='/channels/videos' isDisabled={state === State.REQUEST}>취소</Button>
          <Button
            isDisabled={!file || !video.title}
            isLoading={state === State.REQUEST}
            onClick={onClickConfirm}
          >
            업로드
          </Button>
        </ButtonGroup>
      </CardFooter>
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
