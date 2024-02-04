import { atom, } from 'recoil';

interface TestCount {
  count: number;
}

const testCountAtom = atom<TestCount>({
  key: 'testCountAtom',
  default: {
    count: 0,
  },
});

export type { TestCount, };
export default testCountAtom;
