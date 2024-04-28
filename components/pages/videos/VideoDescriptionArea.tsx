import { memo, useState, } from 'react';
import NextLink from 'next/link';
import { Box, Button, Card, CardBody, Heading, HStack, Link, Spacer, Text, VStack, } from '@chakra-ui/react';
import { MdPlaylistAdd, } from 'react-icons/md';
import { PlayListVideoAddAlert } from '@root/components/alerts';

import { Video, } from '@root/interfaces';

type Props = {
  video: Video;
};

const VideoDescriptionArea = ({
  video,
}: Props) => {
  const [openAddPlayListAlert, setOpenAddPlayListAlert,] = useState<boolean>(false);

  const onClickAddPlayListButton = () => {
    setOpenAddPlayListAlert(true);
  };

  const onClosePlayListVideoAddAlert = () => {
    setOpenAddPlayListAlert(false);
  };

  const onConfirmPlayListVideoAddAlert = () => {
    setOpenAddPlayListAlert(false);
  };

  return <VStack alignItems='stretch'>
    <VStack alignItems='stretch'>
      <Heading size='md' marginTop='0.75rem' marginBottom='0'>{video.getTitle()}</Heading>
      <Link as={NextLink} href={'/accounts/' + video.account.accountKey}>
        <Text fontSize='sm' fontWeight={700}>{video.account.nickname}</Text>
      </Link>
    </VStack>
    <Card>
      <CardBody>
        <VStack alignItems='stretch'>
          <HStack width='100%'>
            <Text fontWeight={700}>{'조회수 ' + video.getViewCount()}</Text>
            <Text fontWeight={700}>{video.getUpdateDate()}</Text>
            <Spacer/>
            <Button
              size='xs'
              variant='outline'
              leftIcon={<MdPlaylistAdd/>}
              onClick={onClickAddPlayListButton}
            >
              재생 목록 추가
            </Button>
          </HStack>
          <HStack>
            {video.tags.map((tag, index) =>
              <Text key={index} color='blue.400'>#{tag}</Text>,
            )}
          </HStack>
          <Box>
            <Text>{video.description}</Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
    {video && video.id && <PlayListVideoAddAlert
      open={openAddPlayListAlert}
      video={video}
      onClose={onClosePlayListVideoAddAlert}
      onConfirm={onConfirmPlayListVideoAddAlert}
    />}
  </VStack>;
};

export default memo(VideoDescriptionArea, (prevProps: Props, nextProps: Props) => {
  if (!prevProps.video || !nextProps.video) {
    return false;
  }

  return prevProps.video.videoKey === nextProps.video.videoKey;
});
