import { memo, useState, } from 'react';
import NextLink from 'next/link';
import { Box, Button, Card, CardBody, Heading, HStack, Link, Spacer, Text, VStack, ButtonGroup, } from '@chakra-ui/react';
import { MdPlaylistAdd, MdShare, } from 'react-icons/md';
import { PlayListVideoAddAlert, RequireLoginAlert, VideoEmbedPopup, } from '@root/components/alerts';

import { useRecoilValue, } from 'recoil';
import { accountAtom, } from '@root/recoil';

import { Account, Video, } from '@root/interfaces';

type Props = {
  video: Video;
};

const VideoDescriptionArea = ({
  video,
}: Props) => {
  const account: Account = useRecoilValue<Account>(accountAtom);

  const [openAddPlayListAlert, setOpenAddPlayListAlert,] = useState<boolean>(false);
  const [openRequireLoginAlert, setOpenRequireLoginAlert,] = useState<boolean>(false);
  const [openVideoEmbedPopup, setOpenVideoEmbedPopup,] = useState<boolean>(false);

  const onClickAddPlayListButton = () => {
    if (account.id) {
      setOpenAddPlayListAlert(true);
    } else {
      setOpenRequireLoginAlert(true);
    }
  };

  const onClosePlayListVideoAddAlert = () => {
    setOpenAddPlayListAlert(false);
  };

  const onConfirmPlayListVideoAddAlert = () => {
    setOpenAddPlayListAlert(false);
  };

  const onCloseRequireLoginAlert = () => {
    setOpenRequireLoginAlert(false);
  };

  const onClickShareButton = () => {
    setOpenVideoEmbedPopup(true);
  };

  const onCloseVideoEmbedPopup = () => {
    setOpenVideoEmbedPopup(false);
  };

  return <VStack alignItems='stretch'>
    <VStack alignItems='start'>
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
            <ButtonGroup size='xs' variant='outline'>
              <Button leftIcon={<MdShare/>} onClick={onClickShareButton}>공유 하기</Button>
              <Button leftIcon={<MdPlaylistAdd/>} onClick={onClickAddPlayListButton}>재생 목록 추가</Button>
            </ButtonGroup>
          </HStack>
          <HStack>
            {video.tags.map((tag, index) =>
              <Text key={`tag-${index}`} color='blue.400'>#{tag}</Text>,
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
    <RequireLoginAlert
      open={openRequireLoginAlert}
      message='재생 목록 기능을 사용하기 위해서는 로그인이 필요합니다.'
      onClose={onCloseRequireLoginAlert}
    />
    <VideoEmbedPopup
      video={video}
      open={openVideoEmbedPopup}
      onClose={onCloseVideoEmbedPopup}
    />
  </VStack>;
};

export default memo(VideoDescriptionArea, (prevProps: Props, nextProps: Props) => {
  if (!prevProps.video || !nextProps.video) {
    return false;
  }

  return prevProps.video.videoKey === nextProps.video.videoKey;
});
