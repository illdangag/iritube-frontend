import { Button, ButtonGroup, } from '@chakra-ui/react';
import { useRecoilValue, useSetRecoilState, } from 'recoil';
import testCountAtom, { increaseTestCount, } from '../recoil/testCount';

const IndexPage = () => {
  const testCount = useRecoilValue(testCountAtom);
  const setIncreaseTestCount = useSetRecoilState(increaseTestCount);

  const onClickIncreaseButton = () => {
    setIncreaseTestCount(100);
  };

  return (
    <div>
      <div>{testCount?.count}</div>
      <ButtonGroup variant='outline' spacing={6}>
        <Button colorScheme='blue' onClick={onClickIncreaseButton}>increase</Button>
      </ButtonGroup>
    </div>
  );
};

export default IndexPage;
