import { GetServerSideProps, } from 'next';
import { Box, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoListView, } from '@root/components';

import { TokenInfo, VideoList, } from '@root/interfaces';
import { getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

type Props = {
  videoList: VideoList,
};

const AccountsAccountKeyPage = (props: Props) => {
  const videoList: VideoList = VideoList.getInstance(props.videoList);

  return <MainLayout title='동영상 목록 | iritube' fullWidth={false}>
    <PageHeaderLayout
      title='동영상 목록'
    />
    <Box paddingBottom='1rem'>
      <VideoListView videoList={videoList} type='thumbnail'/>
    </Box>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  const unit: number = 20;
  const accountKey: string = context.query.accountKey as string;
  const page: number = context.query.page ? Number(context.query.page) : 1;

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  try {
    const videoList: VideoList = await iritubeAPI.getVideoList(tokenInfo, accountKey, unit * (page - 1), unit);
    return {
      props: {
        videoList: JSON.parse(JSON.stringify(videoList)),
      },
    };
  } catch (error) {
    removeTokenInfoByCookies(context);
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }
};

export default AccountsAccountKeyPage;
