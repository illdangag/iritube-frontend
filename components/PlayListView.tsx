import { forwardRef, memo, useEffect, useState, } from 'react';
import NextLink from 'next/link';
import {
  Badge, Box, Button, ButtonGroup, Card, CardBody, CardFooter, HStack, Image, Link, LinkBox, LinkOverlay, Spacer, Text,
  VStack,
} from '@chakra-ui/react';

import * as CSS from 'csstype';
import { PlayList, PlayListShare, PlayListViewType, TokenInfo, Video, VideoShare, } from '@root/interfaces';
import { getTokenInfo, iritubeAPI, } from '@root/utils';

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
  const [imageURL, setImageURL,] = useState<string>('/static/images/transparent.png');

  useEffect(() => {
    const thumbnailVideo: Video | undefined = playList.videos
      .find(video => video.share === VideoShare.PUBLIC && !video.deleted);

    if (thumbnailVideo) {
      void initThumbnail(thumbnailVideo)
        .catch(() => {
          setImageURL('/static/images/black.jpg');
        });
    } else {
      setImageURL('/static/images/black.jpg');
    }
  }, [playList,]);

  const initThumbnail = async (video: Video) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const imageData: string = await iritubeAPI.getVideoThumbnail(tokenInfo, video.videoKey);
    setImageURL(imageData);
  };

  const getPlayListVideoLink = () => {
    const urlSearchParams = new URLSearchParams();
    if (playList.videos.length > 0) {
      urlSearchParams.append('vk', playList.videos[0].videoKey);
    }
    urlSearchParams.append('pk', playList.playListKey);

    return '/videos?' + urlSearchParams.toString();
  };

  const getPlayListThumbnail = (aspectRatio: CSS.Property.AspectRatio) => {
    return <LinkBox>
      <LinkOverlay as={NextLink} href={getPlayListVideoLink()}>
        <Box borderRadius='lg' overflow='hidden' backgroundColor='black' aspectRatio={aspectRatio} position='relative'>
          <Image
            src={imageURL}
            alt='thumbnail'
            position='absolute'
            top='50%'
            left='50%'
            transform='translate(-50%, -50%)'
          />
          <Text
            as='b'
            position='absolute'
            right='0.2rem'
            bottom='0.2rem'
            paddingLeft='0.2rem'
            paddingRight='0.2rem'
            borderRadius='0.2rem'
            backgroundColor='#00000044'
            fontSize='xs'
          >
            동영상 {playList.videos.length}개
          </Text>
        </Box>
      </LinkOverlay>
    </LinkBox>;
  };

  const getThumbnailType = () => {
    return <Card ref={ref} backgroundColor='none' variant='ghost'>
      <CardBody
        padding='0'
        aspectRatio='16/9'
        overflow='hidden'
        borderRadius='lg'
      >
        {getPlayListThumbnail('16/9')}
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
            {getPlayListThumbnail('4/3')}
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
