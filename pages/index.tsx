import { Box, } from '@chakra-ui/react';
import { MainLayout, } from '@root/layouts';
import { VideoListScrollView, } from '@root/components';

import { TokenInfo, } from '@root/interfaces';
import { getTokenInfo, } from '@root/utils';
import iritubeAPI from '@root/utils/iritubeAPI';

const IndexPage = () => {
  const onNextPage = async (offset: number, limit: number) => {
    const tokenInfo: TokenInfo | null = await getTokenInfo();
    return await iritubeAPI.getRecommendVideoList(tokenInfo, offset, limit);
  };

  return (
    <MainLayout title='Iritube'>
      <Box paddingBottom='1rem'>
        <VideoListScrollView onNextPage={onNextPage}/>
      </Box>
    </MainLayout>
  );
};

export default IndexPage;
