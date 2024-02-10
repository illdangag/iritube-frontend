import { GetServerSideProps, } from 'next';
import { MainLayout, } from '@root/layouts';
import { VideoListView, } from '@root/components';

import { TokenInfo, VideoList, } from '@root/interfaces';
import { getTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  videoList: VideoList | null,
}

const IndexPage = (props: Props) => {
  const videoList: VideoList = VideoList.getInstance(props.videoList);

  return (
    <MainLayout>
      <VideoListView videoList={videoList}/>
    </MainLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  try {
    const videoList: VideoList = await iritubeAPI.getRecommendVideoList(tokenInfo, 0, 20);

    return {
      props: {
        videoList: JSON.parse(JSON.stringify(videoList)),
      },
    };
  } catch {
    // TODO 예외 처리
  }
};

export default IndexPage;
