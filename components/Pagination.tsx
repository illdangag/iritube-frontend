// react
import { ButtonGroup, HStack, Button, LinkOverlay, } from '@chakra-ui/react';
// etc
import { ListResponse, } from '@root/interfaces';

type Props = {
  page: number,
  pageMaxLength?: number,
  listResponse: ListResponse,
  pageLinkHref?: string,
};

const Pagination = ({
  page,
  pageMaxLength = 5,
  pageLinkHref = '?page={{page}}',
  listResponse,
}: Props) => {
  return (<HStack justifyContent='center' marginTop='0.4rem'>
    <ButtonGroup size='xs' variant='outline' isAttached>
      {listResponse.getPaginationList(pageMaxLength).map((pagination, index) => <Button
        key={index}
        variant={pagination === page ? 'solid' : 'outline'}
      >
        <LinkOverlay href={pageLinkHref.replaceAll('{{page}}', '' + pagination)}>
          {pagination}
        </LinkOverlay>
      </Button>)}
    </ButtonGroup>
  </HStack>);
};

export default Pagination;
