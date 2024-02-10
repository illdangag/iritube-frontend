import { Box, VStack, Grid, GridItem, } from '@chakra-ui/react';
import { VideoView, Pagination, } from '@root/components';
import { VideoList, } from '@root/interfaces';

type Props = {
  videoList: VideoList,
}

const VideoListView = ({
  videoList,
}: Props) => {

  return <VStack alignItems='stretch'>
    <Grid
      gridTemplateColumns={{
        'base': 'repeat(1, 1fr)',
        'sm': 'repeat(2, 1fr)',
        'lg': 'repeat(3, 1fr)',
        'xl': 'repeat(4, 1fr)',
        '2xl': 'repeat(5, 1fr)',
      }}
      // gridTemplateRows='auto'
      // gridAutoRows='1fr'
      gap={6}
    >
      {videoList.videos.map((item, index) => <GridItem key={index}>
        <VideoView video={item}/>
      </GridItem>)}
    </Grid>
    <Box>
      <Pagination page={0} listResponse={videoList}/>
    </Box>
  </VStack>;
};

export default VideoListView;
