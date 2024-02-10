import { ReactNode, } from 'react';
import EmptyLayout from './EmptyLayout';
import HeaderLayout from './HeaderLayout';

type Props = {
  children?: ReactNode,
  title?: string,
};

const MainLayout = ({
  children,
  title = 'Welcome | iritube',
}: Props) => {
  return <EmptyLayout title={title}>
    <HeaderLayout/>
    {children}
  </EmptyLayout>;
};

export default MainLayout;
