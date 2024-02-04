import { selector, } from 'recoil';
import testCountAtom, { TestCount, } from './atom';

const increaseTestCount = selector<number>({
  key: 'increaseTestCount',
  get: ({ get, }) => {
    return get(testCountAtom).count;
  },
  set: ({ get, set, }, newValue: number) => {
    const count: number = get(testCountAtom).count;
    set(testCountAtom, {
      count: count + newValue,
    } as TestCount);
  },
});

export default increaseTestCount;
