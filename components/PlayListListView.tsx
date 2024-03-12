import { useEffect, useRef, useState, } from 'react';
import { Box, Grid, } from '@chakra-ui/react';
import { PlayListView, } from '@root/components';

import { PlayList, PlayListList, } from '@root/interfaces';

const LIMIT: number = 20;

type Props = {
  onNextPage: (offset: number, limit: number) => Promise<PlayListList>;
}

type PlayListInfo = {
  offset: number;
  nextOffset: number;
}

const PlayListListView = ({
  onNextPage,
}: Props) => {
  const lastPlayListRef = useRef(null);
  const [playLists, setPlayLists,] = useState<PlayList[]>([]);
  const [state, setState,] = useState<PlayListInfo>({
    offset: 0,
    nextOffset: 0,
  } as PlayListInfo);

  useEffect(() => {
    void onNextPage(0, LIMIT)
      .then(playListList => {
        setPlayLists(prev => [...prev, ...playListList.playLists,]);
      });
  }, []);

  useEffect(() => {
    if (state.offset < state.nextOffset) {
      void onNextPage(state.nextOffset, LIMIT)
        .then(playListList => {
          if (playListList.playLists.length > 0) {
            setPlayLists(prev => [...prev, ...playListList.playLists,]);
          }

          setState((prev) => {
            return {
              offset: prev.offset + playListList.playLists.length,
              nextOffset: prev.offset + playListList.playLists.length,
            } as PlayListInfo;
          });
        });
    }
  }, [state,]);

  useEffect(() => {
    if (playLists.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (item) => {
        if (item[0].isIntersecting) {
          setState((prev) => {
            return {
              ...prev,
              nextOffset: prev.offset + LIMIT,
            } as PlayListInfo;
          });
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
