import { useEffect, useRef, } from 'react';
import { Box, Grid, } from '@chakra-ui/react';
import { PlayListView, } from '@root/components';

import { PlayList, } from '@root/interfaces';
import {} from '@root/utils';

type Props = {
  playLists: PlayList[];
  onNextPage?: () => void;
}

const PlayListListView = ({
  playLists,
  onNextPage = () => {},
}: Props) => {

  const lastPlayListRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (item) => {
        if (item[0].isIntersecting) {
          onNextPage();
        }
      },
      {
        threshold: 0,
      },
    );
    observer.observe(lastPlayListRef.current);

    return () => {
      observer.disconnect();
    };
  }, [playLists,]);

  return <Box>
    <Grid
      gridTemplateColumns={{
        'base': 'repeat(1, 1fr)',
        'sm': 'repeat(2, 1fr)',
        'lg': 'repeat(3, 1fr)',
        'xl': 'repeat(4, 1fr)',
        '2xl': 'repeat(5, 1fr)',
      }}
      gap={6}
    >
      {playLists.map((playList, index) => <PlayListView
        playList={playList}
        key={index}
        ref={index === playLists.length - 1 ? lastPlayListRef : undefined}
      />)}
    </Grid>
  </Box>;
};

export default PlayListListView;
