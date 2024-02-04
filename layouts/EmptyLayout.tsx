// react
import { ReactNode, } from 'react';
import Head from 'next/head';

type Props = {
  children?: ReactNode,
  title?: string,
};

const EmptyLayout = ({
  children,
  title = 'Welcome | iritube',
}: Props) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      {children}
    </>
  );
};

export default EmptyLayout;
