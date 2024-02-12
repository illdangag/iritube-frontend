import { ReactNode, } from 'react';
import { Box, } from '@chakra-ui/react';

import EmptyLayout from './EmptyLayout';
import HeaderLayout from './HeaderLayout';

type Props = {
  children?: ReactNode,
  title?: string,
  fullWidth?: boolean,
};

const MainLayout = ({
  children,
  title = 'Welcome | iritube',
  fullWidth = true,
}: Props) => {
  return <EmptyLayout title={title}>
    <HeaderLayout/>
    <Box
      marginLeft='auto'
      marginRight='auto'
      maxWidth={fullWidth ? 'none' : '65rem'}
    >
      {children}
    </Box>
  </EmptyLayout>;
};

export default MainLayout;
