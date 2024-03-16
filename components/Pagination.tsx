import NextLink from 'next/link';
import { ButtonGroup, HStack, Button, LinkOverlay, } from '@chakra-ui/react';
import { ListResponse, } from '@root/interfaces';

type Props = {
  page: number,
  pageMaxLength?: number,
  listResponse: ListResponse,
  setPageLink?: (page: number) => string,
};

const Pagination = ({
  page,
  pageMaxLength = 5,
  listResponse,
  setPageLink = () => '#',
}: Props) => {
  return (<HStack justifyContent='center' marginTop='0.4rem'>
    <ButtonGroup size='xs' variant='outline' isAttached>
      {listResponse.getPaginationList(pageMaxLength).map((pagination, index) => <Button
        key={index}
        variant={pagination === page ? 'solid' : 'outline'}
      >
        <LinkOverlay as={NextLink} href={setPageLink(pagination)}>
          {pagination}
        </LinkOverlay>
      </Button>)}
    </ButtonGroup>
  </HStack>);
};

export default Pagination;
