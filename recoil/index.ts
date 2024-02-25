import { atom, } from 'recoil';
import { v4, } from 'uuid';
import { Account, PlayListList, } from '@root/interfaces';

const accountAtom = atom<Account | null>({
  key: 'accountAtom/' + v4(),
  default: null,
});

const playListListAtom = atom<PlayListList | null>({
  key: 'playListListAtom/' + v4(),
  default: null,
});

export { accountAtom, playListListAtom, };
