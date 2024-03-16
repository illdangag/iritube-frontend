import { useEffect, useRef, useState, } from 'react';
import { Box, Card, CardBody, Grid, GridItem, Image, Text, VStack, } from '@chakra-ui/react';
import { VideoView, } from '@root/components';

import { VideoList, Video, VideoViewType, } from '@root/interfaces';

const LIMIT: number = 20;

type Props = {
  type?: VideoViewType;
  onNextPage: (offset: number, limit: number) => Promise<VideoList>;
}

type ComponentState = {
  offset: number;
  total: number;
  nextOffset: number;
}

const VideoListScrollView = ({
  type = 'thumbnail',
  onNextPage,
}: Props) => {
  const lastVideoRef = useRef(null);
  const [videos, setVideos,] = useState<Video[]>([]);
  const [state, setState,] = useState<ComponentState>({
    offset: 0,
    total: -1,
    nextOffset: 0,
  });

  useEffect(() => {
    void onNextPage(0, LIMIT)
      .then(videoList => {
        setVideos(prev => [...prev, ...videoList.videos,]);
        setState(prev => {
          return {
            ...prev,
            total: videoList.total,
          } as ComponentState;
        });
      });
  }, []);

  useEffect(() => {
    if (videos.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (item) => {
        if (item[0].isIntersecting) {
          setState(prev => {
            return {
              ...prev,
              nextOffset: prev.offset + LIMIT,
            } as ComponentState;
          });
        }
      },
      {
        threshold: 0,
      },
    );
    observer.observe(lastVideoRef.current);

    return () => {
      observer.disconnect();
    };
  }, [videos,]);

  useEffect(() => {
    if (state.offset < state.nextOffset) {
      void onNextPage(state.nextOffset, LIMIT)
        .then(videoList => {
          if (videoList.videos.length > 0) {
            setVideos(prev => [...prev, ...videoList.videos,]);
          }

          setState((prev) => {
            return {
              offset: prev.offset + videoList.videos.length,
              nextOffset: prev.offset + videoList.videos.length,
              total: videoList.total,
            } as ComponentState;
          });
        });
    }
  }, [state,]);

  const getThumbnailType = () => {
    return <Grid
      gridTemplateColumns={{
        'base': 'repeat(1, 1fr)',
        'sm': 'repeat(2, 1fr)',
        'lg': 'repeat(3, 1fr)',
        'xl': 'repeat(4, 1fr)',
        '2xl': 'repeat(5, 1fr)',
      }}
      gap={6}
    >
      {videos.map((item, index) => <GridItem key={index}>
        <VideoView
          video={item}
          type={type}
          ref={index === videos.length - 1 ? lastVideoRef : undefined}
        />
      </GridItem>)}
    </Grid>;
  };

  const getDetailType = () => {
    return <VStack alignItems='stretch'>
      {videos.map((video, index) => <Box key={index}>
        <VideoView
          video={video}
          type={type}
          ref={index === videos.length - 1 ? lastVideoRef : undefined}
        />
      </Box>)}
    </VStack>;
  };

  return <VStack alignItems='stretch'>
    {state.total === 0 && <Card>
      <CardBody display='flex' flexDirection='column' alignItems='center' gap='1rem'>
        <Image src='/static/images/inbox.png' maxWidth='8rem'/>
        <Text fontWeight={500}>동영상이 존재하지 않습니다</Text>
      </CardBody>
    </Card>}
    {state.total > 0 && type === 'thumbnail' && getThumbnailType()}
    {state.total > 0 && type === 'detail' && getDetailType()}
  </VStack>;
};

export default VideoListScrollView;
