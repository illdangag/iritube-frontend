import { useEffect, useState, } from 'react';
import { Spinner, VStack, } from '@chakra-ui/react';
import { VideoCommentView, } from '@root/components';

import { TokenInfo, Video, VideoComment, VideoCommentList, } from '@root/interfaces';
import { getTokenInfo, iritubeAPI, } from '@root/utils';

type Props = {
  video: Video,
};

enum Status {
  IDLE = 'IDLE',
  REQUEST = 'REQUEST',
}

const VideoCommentListArea = ({
  video,
}: Props) => {
  const [status, setStatus,] = useState<Status>(Status.IDLE);
  const [videoComments, setVideoComments,] = useState<VideoComment[]>([]);

  useEffect(() => {
    void init();
  }, []);

  const init = async () => {
    setStatus(Status.REQUEST);
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    const videoCommentList: VideoCommentList = await iritubeAPI.getVideoCommentList(tokenInfo, video.videoKey);
    const newVideoComments: VideoComment[] = videoCommentList.comments
      .sort((itemA, itemB) => {
        return itemB.createDate - itemA.createDate;
      });
    setVideoComments(newVideoComments);
    setStatus(Status.IDLE);
  };

  return <VStack gap='1rem'>
    {videoComments.map((videoComment) =>
      <VideoCommentView
        key={videoComment.videoCommentKey}
        videoComment={videoComment}
      />,
    )}
    {status === Status.REQUEST && <Spinner/>}
  </VStack>;
};

export default VideoCommentListArea;
