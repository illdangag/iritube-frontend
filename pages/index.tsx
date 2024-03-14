import { useState, useEffect, } from 'react';
import { GetServerSideProps, } from 'next';
import { Box, } from '@chakra-ui/react';
import { MainLayout, } from '@root/layouts';
import { VideoListView, } from '@root/components';

import { TokenInfo, Video, VideoList, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  videoList: VideoList | null,
}

const VIDEO_LIMIT: number = 20;

const IndexPage = (props: Props) => {
  const videoList: VideoList = VideoList.getInstance(props.videoList);

  const [videos, setVideos,] = useState<Video[]>(videoList.videos);
  const [videoTotal, setVideoTotal,] = useState<number>(videoList.total);
  const [page, setPage,] = useState<number>(0);

  useEffect(() => {
    if (videos.length < videoTotal) {
      void getNextVideoList(page);
    }
  }, [page,]);

  const onNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const getNextVideoList = async (page: number) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const newVideoListList: VideoList = await iritubeAPI.getRecommendVideoList(tokenInfo, (page + 1) * VIDEO_LIMIT, VIDEO_LIMIT);
    setVideoTotal(newVideoListList.total);
    setVideos(prevState => {
      return [...prevState, ...newVideoListList.videos,];
    });
  };

  return (
    <MainLayout title='Iritube'>
      <Box paddingBottom='1rem'>
        <VideoListView videos={videos} onNextPage={onNextPage}/>
      </Box>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  try {
    const videoList: VideoList = await iritubeAPI.getRecommendVideoList(tokenInfo, 0, VIDEO_LIMIT);

    return {
      props: {
        videoList: JSON.parse(JSON.stringify(videoList)),
      },
    };
  } catch {
    // TODO 예외 처리
  }
};

export default IndexPage;
