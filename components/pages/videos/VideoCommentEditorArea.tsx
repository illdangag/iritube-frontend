import { useState, } from 'react';
import { Button, VStack, } from '@chakra-ui/react';
import { VideoCommentEditor, } from '@root/components';

import { Account, TokenInfo, Video, VideoComment, } from '@root/interfaces';
import { useRecoilValue, } from 'recoil';
import { accountAtom, } from '@root/recoil';
import { getTokenInfo, iritubeAPI, } from '@root/utils';

type Props = {
  video: Video,
};

enum Status {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const VideoCommentEditorArea = ({
  video,
}: Props) => {
  const account: Account = useRecoilValue<Account>(accountAtom);
  const [videoComment, setVideoComment,] = useState<VideoComment>(new VideoComment());
  const [state, setState,] = useState<Status>(Status.IDLE);

  const onChangeVideoComment = (value: VideoComment) => {
    setVideoComment(value);
  };

  const onClickConfirm = async () => {
    const tokenInfo: TokenInfo = await getTokenInfo();
    setState(Status.REQUEST);

    try {
      await iritubeAPI.createVideoComment(tokenInfo, video, videoComment.comment);
      setVideoComment(new VideoComment());
    } finally {
      setState(Status.IDLE);
    }
  };

  return <VStack alignItems='stretch' width='100%'>
    <VideoCommentEditor
      value={videoComment}
      isDisabled={state === Status.REQUEST}
      onChange={onChangeVideoComment}
    />
    <Button
      marginLeft='auto'
      size='sm'
      isDisabled={videoComment.comment.length === 0 || !account || !account.id}
      isLoading={state === Status.REQUEST}
      onClick={onClickConfirm}
    >
      등록
    </Button>
  </VStack>;
};

export default VideoCommentEditorArea;
