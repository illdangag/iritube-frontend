import { atom, } from 'recoil';
import { v4, } from 'uuid';
import { Account, } from '../interfaces';

const myAccountAtom = atom<Account | null>({
  key: 'myAccountAtom/' + v4(),
  default: null,
});

export { myAccountAtom, };
