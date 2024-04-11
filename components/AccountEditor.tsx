import { ChangeEvent, useEffect, useState, } from 'react';
import { FormControl, FormLabel, Input, StackProps, VStack, } from '@chakra-ui/react';
import { Account, AccountAuth, } from '@root/interfaces';

interface Props extends Omit<StackProps, 'onChange'> {
  value?: Account;
  isDisabled?: boolean;
  onChange?: (account: Account) => void;
}

const AccountEditor = (props: Props) => {
  const account: Account = props.value || {
    id: '',
    accountKey: '',
    nickname: '',
    auth: AccountAuth.ACCOUNT,
  } as Account;
  const isDisabled: boolean = props.isDisabled;
  const onChange: (account: Account) => void = props.onChange || (() => {});

  const [editAccount, setEditAccount,] = useState<Account>(account);

  useEffect(() => {
    onChange(editAccount);
  }, [editAccount,]);

  const getStackProps = (): StackProps => {
    const stackProps: Props = {
      ...props,
    };

    delete stackProps.onChange;
    delete stackProps.isDisabled;

    return stackProps as unknown as StackProps;
  };

  const onChangeNickname = (event: ChangeEvent<HTMLInputElement>) => {
    setEditAccount({
      ...editAccount,
      nickname: event.target.value,
    });
  };

  return <VStack {...getStackProps()}>
    <FormControl>
      <FormLabel>닉네임</FormLabel>
      <Input value={account ? account.nickname : ''} isDisabled={isDisabled} onChange={onChangeNickname}/>
    </FormControl>
  </VStack>;
};

export default AccountEditor;
