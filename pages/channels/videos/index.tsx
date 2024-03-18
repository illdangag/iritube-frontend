import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import { Box, Button, } from '@chakra-ui/react';
import { MainLayout, PageHeaderLayout, } from '@root/layouts';
import { Pagination, VideoListView, } from '@root/components';

import { TokenInfo, VideoList, } from '@root/interfaces';
import { getTokenInfoByCookies, removeTokenInfoByCookies, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';
import NextLink from 'next/link';

type Props = {
  page: number,
  videoList: VideoList,
}

const VIDEO_LIMIT: number = 20;

const AccountsVideosPage = (props: Props) => {
  const page: number = props.page;
  const videoList = VideoList.getInstance(props.videoList);

  const router = useRouter();

  const setPageLink = (page: number) => {
    return '/channels/videos?page=' + page;
  };

  const onDeleteVideo = () => {
    void router.replace('/channels/videos?page=' + page);
  };

  return <MainLayout title='동영상 목록 | iritube' fullWidth={false}>
    <PageHeaderLayout
      title='동영상 목록'
      descriptions={['업로드한 동영상 목록을 조회합니다',]}
      rightContent={<Button size='sm' as={NextLink} href='/channels/videos/upload'>동영상 업로드</Button>}
    />
    <Box paddingBottom='1rem'>
      <VideoListView type='detail' videos={videoList.videos} onDeleteVideo={onDeleteVideo}/>
      <Box>
        <Pagination page={0} listResponse={videoList} setPageLink={setPageLink}/>
      </Box>
    </Box>
  </MainLayout>;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const pageVariable: string = context.query.page as string;
  const tokenInfo: TokenInfo | null = await getTokenInfoByCookies(context);

  if (tokenInfo === null) {
    return {
      redirect: {
        permanent: false,
        destination: '/login?success=' + encodeURIComponent(context.resolvedUrl),
      },
    };
  }

  const page: number = pageVariable ? Number.parseInt(pageVariable) : 1;
  if (isNaN(page)) {
    return {
      redirect: {
        permanent: false,
        destination: '/channels/videos',
      },
    };
  }

  try {
    await iritubeAPI.getMyAccount(tokenInfo);
    const videoList: VideoList = await iritubeAPI.getMyVideoList(tokenInfo, (page - 1) * VIDEO_LIMIT, VIDEO_LIMIT);
    const total: number = videoList.total;
    const videoLength: number = videoList.videos.length;

    if (total > 0 && videoLength === 0) { // 동영상 목록은 존재 하지만 해당 페이지에 동영상이 존재하지 않는 경우
      const lastPage: number = Math.floor(total / VIDEO_LIMIT);

      return {
        redirect: {
          permanent: false,
          destination: '/channels/videos?page=' + (lastPage < page ? lastPage : page),
        },
      };
    }

    return {
      props: {
        videoList: JSON.parse(JSON.stringify(videoList)),
        page: page,
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
