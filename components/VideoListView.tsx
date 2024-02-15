import { Box, VStack, Grid, GridItem, } from '@chakra-ui/react';
import { VideoView, Pagination, } from '@root/components';
import { VideoList, VideoViewType, } from '@root/interfaces';

type Props = {
  videoList: VideoList,
  type?: VideoViewType,
}

const VideoListView = ({
  videoList,
  type = 'thumbnail',
}: Props) => {

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
      {videoList.videos.map((item, index) => <GridItem key={index}>
        <VideoView video={item} type={type}/>
      </GridItem>)}
    </Grid>;
  };

  const getDetailType = () => {
    return <VStack alignItems='stretch'>
      {videoList.videos.map((item, index) => <Box key={index}>
        <VideoView video={item} type={type}/>
      </Box>)}
    </VStack>;
  };

  return <VStack alignItems='stretch'>
    {type === 'thumbnail' && getThumbnailType()}
    {type === 'detail' && getDetailType()}
    <Box>
      <Pagination page={0} listResponse={videoList}/>
    </Box>
  </VStack>;
};

export default VideoListView;
