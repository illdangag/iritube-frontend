import { useState, } from 'react';
import { GetServerSideProps, } from 'next';
import { Box, Button, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { VideoListView, } from '@root/components';

import { TokenInfo, VideoList, } from '@root/interfaces';
import { getTokenInfo, getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';
import NextLink from 'next/link';

type Props = {
  videoList: VideoList,
}

const AccountsVideosPage = (props: Props) => {
  const [videoList, setVideoList,] = useState<VideoList>(VideoList.getInstance(props.videoList));

  const onChangeVideoList = async () => {
    const tokenInfo: TokenInfo = await getTokenInfo();
    const newVideoList: VideoList = await iritubeAPI.getMyVideoList(tokenInfo, 0, 10);
    setVideoList(newVideoList);
  };

  return <MainLayout title='동영상 목록 | iritube' fullWidth={false}>
    <PageHeaderLayout
      title='동영상 목록'
      descriptions={['업로드한 동영상 목록을 조회합니다',]}
      rightContent={<Button size='sm' as={NextLink} href='/accounts/videos/upload'>동영상 업로드</Button>}
    />
    <Box paddingBottom='1rem'>
      <VideoListView videoList={videoList} type='detail' onChange={onChangeVideoList}/>
    </Box>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  try {
    await iritubeAPI.getMyAccount(tokenInfo);
    const videoList: VideoList = await iritubeAPI.getMyVideoList(tokenInfo, 0, 10);
    return {
      props: {
        videoList: JSON.parse(JSON.stringify(videoList)),
      },
    };
  } catch {
    removeTokenInfoByCookies(context);
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }
};

export default AccountsVideosPage;
