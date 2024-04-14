import {} from 'react';
import { Card, CardBody, Image, Text, VStack, } from '@chakra-ui/react';
import { PlayListView, } from '@root/components';

import { PlayList, PlayListViewType, } from '@root/interfaces';

type Props = {
  type?: PlayListViewType;
  playLists: PlayList[];
  editable?: boolean;
  onClickDelete?: (playList: PlayList) => void;
}

const PlayListListView = ({
  type = 'thumbnail',
  playLists,
  editable = false,
  onClickDelete = () => {},
}: Props) => {
  return <VStack alignItems='stretch'>
    {playLists.length === 0 && <Card>
      <CardBody display='flex' flexDirection='column' alignItems='center' gap='1rem'>
        <Image src='/static/images/inbox.png' maxWidth='8rem'/>
        <Text fontWeight={500}>재생 목록이 존재하지 않습니다</Text>
      </CardBody>
    </Card>}
    {playLists.map((playList, index) => <PlayListView
      playList={playList} key={index} type={type} editable={editable} onClickDelete={onClickDelete}
    />)}
  </VStack>;
};

export default PlayListListView;
