import { forwardRef, memo, } from 'react';
import NextLink from 'next/link';
import {
  Badge, Box, Button, ButtonGroup, Card, CardBody, CardFooter, HStack, Link, LinkBox, LinkOverlay, Spacer, Text,
  VStack,
} from '@chakra-ui/react';
import { VideoThumbnail, } from '@root/components';

import { PlayList, PlayListShare, PlayListViewType,  } from '@root/interfaces';

type Props = {
  type?: PlayListViewType;
  playList: PlayList;
  editable?: boolean;
}

const PlayListView = ({
  type = 'thumbnail',
  playList,
  editable = false,
}: Props, ref) => {
  const getPlayListVideoLink = () => {
    const urlSearchParams = new URLSearchParams();
    if (playList.videos.length > 0) {
      urlSearchParams.append('vk', playList.videos[0].videoKey);
    }
    urlSearchParams.append('pk', playList.playListKey);

    return '/videos?' + urlSearchParams.toString();
  };

  const getThumbnailType = () => {
    return <Card ref={ref} backgroundColor='none' variant='ghost'>
      <CardBody
        padding='0'
        aspectRatio='16/9'
        overflow='hidden'
        borderRadius='lg'
      >
        <LinkBox>
          <LinkOverlay as={NextLink} href={getPlayListVideoLink()}>
            <VideoThumbnail video={playList.videos[0]} aspectRatio={16 / 9} description={`동영상 ${playList.videos.length}개`}/>
          </LinkOverlay>
        </LinkBox>
      </CardBody>
      <CardFooter paddingTop='0.5rem' paddingRight='0' paddingBottom='0' paddingLeft='0'>
        <Text as='b'>{playList.title}</Text>
      </CardFooter>
    </Card>;
  };

  const getPlayListShare = (playListShare: PlayListShare): string => {
    switch (playListShare) {
      case PlayListShare.PRIVATE:
        return '비공개';
      case PlayListShare.PUBLIC:
        return '공개';
      case PlayListShare.URL:
        return '링크 공유';
    }
  };

  const getPlayListShareBadge = (playListShare: PlayListShare) => {
    return <Badge colorScheme='gray'>
      {getPlayListShare(playListShare)}
    </Badge>;
  };

  const getDetailType = () => {
    return <Card ref={ref}>
      <CardBody>
        <HStack alignItems='stretch'>
          <Box width='10rem' flexShrink='0'>
            <LinkBox>
              <LinkOverlay as={NextLink} href={getPlayListVideoLink()}>
                <VideoThumbnail video={playList.videos[0]} aspectRatio={4 / 3} description={`동영상 ${playList.videos.length}개`}/>
              </LinkOverlay>
            </LinkBox>
          </Box>
          <VStack alignItems='start' gap='0' flexGrow='1'>
            <Link as={NextLink} _hover={{ textDecoration: 'none', }} href={getPlayListVideoLink()}>
              <Text as='b'>{playList.title}</Text>
            </Link>
            <Link _hover={{ textDecoration: 'none', }} as={NextLink} href={'/accounts/' + playList.account.accountKey}>
              <Text fontSize='xs' as='span'>{playList.account.nickname}</Text>
            </Link>
            <Spacer/>
            <HStack width='100%'>
              {getPlayListShareBadge(playList.share)}
              {editable && <>
                <Spacer/>
                <ButtonGroup size='xs' variant='outline' marginTop='auto'>
                  <Button as={NextLink} href={`/channels/playlists/${playList.playListKey}/edit`}>수정</Button>
                  <Button>삭제</Button>
                </ButtonGroup>
              </>}
            </HStack>
          </VStack>
        </HStack>
      </CardBody>
    </Card>;
  };

  return <>
    {type === 'thumbnail' && getThumbnailType()}
    {type === 'detail' && getDetailType()}
  </>;
};
const equalComparison = (prevProps: Props, nextProps: Props): boolean => {
  return prevProps.playList.playListKey === nextProps.playList.playListKey;
};

export default memo(forwardRef(PlayListView), equalComparison);
