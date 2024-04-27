import { memo, } from 'react';
import { VStack, Text, HStack, } from '@chakra-ui/react';
import {} from '@root/components';

import { VideoComment, } from '@root/interfaces';

type Props = {
  videoComment: VideoComment;
};

const VideoCommentView = ({
  videoComment,
}: Props) => {
  return <VStack width='100%' alignItems='start' gap='0'>
    <HStack>
      <Text fontSize='xs' fontWeight='800'>{videoComment.account.nickname}</Text>
      <Text fontSize='xs'>{videoComment.getUpdateDate()}</Text>
    </HStack>
    <Text fontSize='md'>
      {videoComment.comment}
    </Text>
  </VStack>;
};

export default memo(VideoCommentView, (prevProps: Props, nextProps: Props) => {
  if (!prevProps.videoComment) {
    return false;
  }

  return prevProps.videoComment.videoCommentKey === nextProps.videoComment.videoCommentKey;
});

