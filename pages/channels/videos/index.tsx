import { useEffect, useState, } from 'react';
import { GetServerSideProps, } from 'next';
import { Box, Button, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoListView, } from '@root/components';

import { TokenInfo, Video, VideoList, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';
import NextLink from 'next/link';

type Props = {
  videoList: VideoList,
}

const VIDEO_LIMIT: number = 20;

const AccountsVideosPage = (props: Props) => {
  const videoList: VideoList = VideoList.getInstance(props.videoList);
  const [videos, setVideos,] = useState<Video[]>(videoList.videos);
  const [videoTotal, setVideoTotal,] = useState<number>(videoList.total);
  const [page, setPage,] = useState<number>(0);

  useEffect(() => {
    if (videos.length < videoTotal) {
      void getNextVideoList(page);
    }
  }, [page,]);

  const getNextVideoList = async (page: number) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const newVideoListList: VideoList = await iritubeAPI.getMyVideoList(tokenInfo, (page + 1) * VIDEO_LIMIT, VIDEO_LIMIT);
    setVideoTotal(newVideoListList.total);
    setVideos(prevState => {
      return [...prevState, ...newVideoListList.videos,];
    });
  };

  const onNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  return <MainLayout title='동영상 목록 | iritube' fullWidth={false}>
    <PageHeaderLayout
      title='동영상 목록'
      descriptions={['업로드한 동영상 목록을 조회합니다',]}
      rightContent={<Button size='sm' as={NextLink} href='/accounts/videos/upload'>동영상 업로드</Button>}
    />
    <Box paddingBottom='1rem'>
      <VideoListView videos={videos} type='detail' onNextPage={onNextPage}/>
    </Box>
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
    await iritubeAPI.getMyAccount(tokenInfo);
    const videoList: VideoList = await iritubeAPI.getMyVideoList(tokenInfo, 0, VIDEO_LIMIT);
    return {
      props: {
        videoList: JSON.parse(JSON.stringify(videoList)),
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

export default AccountsVideosPage;
