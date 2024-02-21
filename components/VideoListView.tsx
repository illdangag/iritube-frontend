import { useState, } from 'react';
import { Box, VStack, Grid, GridItem, Card, CardBody, Image, Text, } from '@chakra-ui/react';
import { VideoView, Pagination, } from '@root/components';
import { VideoDeleteAlert, } from '@root/components/alerts';

import { TokenInfo, Video, VideoList, VideoViewType, } from '@root/interfaces';
import { getTokenInfo, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';


type Props = {
  videoList: VideoList;
  type?: VideoViewType;
  onChange?: (video: Video) => void;
}

const VideoListView = ({
  videoList,
  type = 'thumbnail',
  onChange = () => {},
}: Props) => {
  const [deleteVideo, setDeleteVideo,] = useState<Video | null>(null);
  const [openDeleteAlert, setOpenDeleteAlert,] = useState<boolean>(false);
  const [loadingDeleteAlert, setLoadingDeleteAlert,] = useState<boolean>(false);

  const onDelete = (video: Video) => {
    setDeleteVideo(video);
    setOpenDeleteAlert(true);
  };

  const onCloseDeleteAlert = () => {
    setOpenDeleteAlert(false);
  };

  const onConfirmDeleteAlert = async (video: Video) => {
    setLoadingDeleteAlert(true);
    const tokenInfo: TokenInfo = await getTokenInfo();
    try {
      const deleteVideo: Video = await iritubeAPI.deleteVideo(tokenInfo, video.videoKey);
      onChange(deleteVideo);
    } finally {
      setOpenDeleteAlert(false);
      setLoadingDeleteAlert(false);
    }
  };

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
      {videoList.videos.map((video, index) => <Box key={index}>
        <VideoView video={video} type={type} onDelete={() => onDelete(video)}/>
      </Box>)}
    </VStack>;
  };

  return <>
    <VStack alignItems='stretch'>
      {videoList && videoList.videos.length === 0 && <Card>
        <CardBody display='flex' flexDirection='column' alignItems='center' gap='1rem'>
          <Image src='/static/images/inbox.png' maxWidth='8rem'/>
          <Text fontWeight={500}>동영상이 존재하지 않습니다</Text>
        </CardBody>
      </Card>}
      {type === 'thumbnail' && getThumbnailType()}
      {type === 'detail' && getDetailType()}
      <Box>
        <Pagination page={0} listResponse={videoList}/>
      </Box>
    </VStack>
    <VideoDeleteAlert
      open={openDeleteAlert}
      loading={loadingDeleteAlert}
      video={deleteVideo}
      onClose={onCloseDeleteAlert}
      onConfirm={onConfirmDeleteAlert}
    />
  </>;
};

export default VideoListView;
