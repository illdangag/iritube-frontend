import { memo, useState, } from 'react';
import NextLink from 'next/link';
import { Box, Button, Card, CardBody, Heading, HStack, Link, Spacer, Text, VStack, } from '@chakra-ui/react';
import { MdPlaylistAdd, } from 'react-icons/md';
import { PlayListVideoAddAlert, RequireLoginAlert, } from '@root/components/alerts';

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

  const onClickAddPlayListButton = () => {
    console.log(account);
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
  </VStack>;
};

export default memo(VideoDescriptionArea, (prevProps: Props, nextProps: Props) => {
  if (!prevProps.video || !nextProps.video) {
    return false;
  }

  return prevProps.video.videoKey === nextProps.video.videoKey;
});
