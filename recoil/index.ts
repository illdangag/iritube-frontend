import { atom, } from 'recoil';
import { v4, } from 'uuid';
import { Account, } from '@root/interfaces';

const accountAtom = atom<Account | null>({
  key: 'accountAtom/' + v4(),
  default: null,
});

export { accountAtom, };
