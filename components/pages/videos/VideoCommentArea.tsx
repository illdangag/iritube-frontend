import { memo, useEffect, useState, } from 'react';
import { useRouter, } from 'next/router';
import { Button, Card, CardBody, VStack, } from '@chakra-ui/react';
import { Pagination, VideoCommentEditor, VideoCommentView, } from '@root/components';

import { Account, TokenInfo, Video, VideoComment, VideoCommentList, } from '@root/interfaces';
import { useRecoilValue, } from 'recoil';
import { accountAtom, } from '@root/recoil';
import { getTokenInfo, iritubeAPI, } from '@root/utils';

type Props = {
  video: Video,
  videoCommentPage?: number,
}

enum CreateState {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const COMMENT_LIMIT: number = 10;

const VideoCommentArea = ({
  video,
  videoCommentPage = 1,
}: Props) => {
  const router = useRouter();
  const account: Account = useRecoilValue<Account>(accountAtom);

  const [createState, setCreateState,] = useState<CreateState>(CreateState.IDLE);
  const [videoComment, setVideoComment,] = useState<VideoComment>(new VideoComment());

  const [videoComments, setVideoComments,] = useState<VideoComment[]>([]);
  const [videoCommentList, setVideoCommentList,] = useState<VideoCommentList | null>(null);

  useEffect(() => {
    void init();
  }, [video, videoCommentPage,]);

  const init = async () => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const videoCommentList: VideoCommentList = await iritubeAPI.getVideoCommentList(tokenInfo, video.videoKey, (videoCommentPage - 1) * COMMENT_LIMIT, COMMENT_LIMIT);
    setVideoCommentList(videoCommentList);
  };

  const onChangeVideoComment = (value: VideoComment) => {
    setVideoComment(value);
  };

  /**
   * 댓글 작성
   */
  const onClickConfirm = async () => {
    const tokenInfo: TokenInfo = await getTokenInfo();
    setCreateState(CreateState.REQUEST);

    try {
      const newVideoComment: VideoComment = await iritubeAPI.createVideoComment(tokenInfo, video, videoComment.comment);
      const newVideoCommentList: VideoCommentList = await iritubeAPI.getVideoCommentList(tokenInfo, video.videoKey, 0, COMMENT_LIMIT);

      setVideoComment(new VideoComment());
      setVideoComments([
        newVideoComment,
        ...videoComments,
      ]);

      void router.push(setCommentPageLink(newVideoCommentList.totalPage));
    } finally {
      setCreateState(CreateState.IDLE);
    }
  };

  const setCommentPageLink = (page: number) => {
    return router.pathname + '?vk=' + router.query.vk + '&cp=' + page;
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
    {videoCommentList && videoCommentList.total > 0 && <Card>
      <CardBody>
        <VStack alignItems='stretch'>
          <VStack gap='1rem'>
            {videoCommentList.comments.map(videoComment => <VideoCommentView key={videoComment.videoCommentKey} videoComment={videoComment}/>)}
          </VStack>
          <Pagination page={videoCommentList.currentPage} listResponse={videoCommentList} setPageLink={setCommentPageLink}/>
        </VStack>
      </CardBody>
    </Card>}
  </VStack>;
};

export default VideoCommentArea;
