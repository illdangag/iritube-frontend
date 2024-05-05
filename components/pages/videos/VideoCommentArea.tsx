import { memo, useEffect, useState, } from 'react';
import { Button, Card, CardBody, Spinner, VStack, } from '@chakra-ui/react';
import { VideoCommentEditor, VideoCommentView, } from '@root/components';

import { Account, TokenInfo, Video, VideoComment, VideoCommentList, } from '@root/interfaces';
import { useRecoilValue, } from 'recoil';
import { accountAtom, } from '@root/recoil';
import { getTokenInfo, iritubeAPI, } from '@root/utils';

type Props = {
  video: Video,
}

enum CreateState {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

enum ListState {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const VideoCommentArea = ({
  video,
}: Props) => {
  const account: Account = useRecoilValue<Account>(accountAtom);

  const [createState, setCreateState,] = useState<CreateState>(CreateState.IDLE);
  const [videoComment, setVideoComment,] = useState<VideoComment>(new VideoComment());

  const [listState, setListState,] = useState<ListState>(ListState.IDLE);
  const [videoComments, setVideoComments,] = useState<VideoComment[]>([]);

  useEffect(() => {
    void init();
  }, [video,]);

  const init = async () => {
    setListState(ListState.REQUEST);
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const videoCommentList: VideoCommentList = await iritubeAPI.getVideoCommentList(tokenInfo, video.videoKey);
    const newVideoComments: VideoComment[] = videoCommentList.comments
      .sort((itemA, itemB) => {
        return itemB.createDate - itemA.createDate;
      });
    setVideoComments(newVideoComments);
    setListState(ListState.IDLE);
  };

  const onChangeVideoComment = (value: VideoComment) => {
    setVideoComment(value);
  };

  const onClickConfirm = async () => {
    const tokenInfo: TokenInfo = await getTokenInfo();
    setCreateState(CreateState.REQUEST);

    try {
      const newVideoComment: VideoComment = await iritubeAPI.createVideoComment(tokenInfo, video, videoComment.comment);

      setVideoComment(new VideoComment());
      setVideoComments([
        newVideoComment,
        ...videoComments,
      ]);
    } finally {
      setCreateState(CreateState.IDLE);
    }
  };

  return <VStack alignItems='stretch'>
    <Card>
      <CardBody>
        <VStack alignItems='stretch' width='100%'>
          <VideoCommentEditor
            value={videoComment}
            isDisabled={createState === CreateState.REQUEST || !account || !account.id}
            placeholder={(!account || !account.id) ? '로그인 후 등록 가능합니다' : '댓글을 입력하세요'}
            onChange={onChangeVideoComment}
          />
          <Button
            marginLeft='auto'
            size='sm'
            isDisabled={videoComment.comment.length === 0 || !account || !account.id}
            isLoading={createState === CreateState.REQUEST}
            onClick={onClickConfirm}
          >
            등록
          </Button>
        </VStack>
      </CardBody>
    </Card>
    {videoComments.length > 0 && <Card>
      <CardBody>
        <VStack gap='1rem'>
          {videoComments.map((videoComment) =>
            <VideoCommentView
              key={videoComment.videoCommentKey}
              videoComment={videoComment}
            />,
          )}
          {listState === ListState.REQUEST && <Spinner/>}
        </VStack>
      </CardBody>
    </Card>}
  </VStack>;
};

export default memo(VideoCommentArea, (prevProps: Props, nextProps: Props) => {
  if (!prevProps.video || !nextProps.video) {
    return false;
  }

  return prevProps.video.videoKey === nextProps.video.videoKey;
});
