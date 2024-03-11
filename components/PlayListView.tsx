import { forwardRef, } from 'react';
import { Box, Card, CardBody, LinkBox, Text, } from '@chakra-ui/react';
import {} from '@root/components';

import { PlayList, } from '@root/interfaces';

type Props = {
  playList: PlayList;
}

const PlayListView = ({
  playList,
}: Props, ref) => {
  return <Card ref={ref} backgroundColor='none' variant='ghost'>
    <CardBody padding={0}>
      <LinkBox>
        <Box borderRadius='lg' overflow='hidden' backgroundColor='black' aspectRatio='16/9' position='relative' minWidth='10rem'>

        </Box>
      </LinkBox>
      <Text>{playList.title}</Text>
    </CardBody>
  </Card>;
};

export default forwardRef(PlayListView);
