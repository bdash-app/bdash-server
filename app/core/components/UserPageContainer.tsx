import { Heading, HStack, Button } from "@chakra-ui/react"
import { Head, usePaginatedQuery, useRouter } from "blitz"
import { User } from "db"
import React from "react"
import { BdashQueryList } from "./BdashQueryList"
import { ContentBox } from "./ContentBox"
import getBdashQueries from "app/bdash-queries/queries/getBdashQueries"

const ITEMS_PER_PAGE = 25;

type Props = {
  user: User
}

export const UserPageContainer: React.FC<Props> = ({ user }) => {
  const router = useRouter();
  const page = Number(router.query.page) || 0;
  const [{ bdashQueries, hasMore }] = usePaginatedQuery(getBdashQueries, {
    orderBy: { createdAt: "desc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where: {
      userId: user.id,
    },
  });

  const goToPreviousPage = () => router.push({ query: { userName: user.name, page: page - 1 } });
  const goToNextPage = () => router.push({ query: { userName: user.name, page: page + 1 } });

  const isPagerHidden = page === 0 && !hasMore;

  return (
    <>
      <Head>
        <title>{`${user.name}'s queries | Bdash Server`}</title>
      </Head>

      <ContentBox>
        <Heading as="h2" size="lg" marginBottom={4}>
          {`${user.name}'s queries`}
        </Heading>
        <BdashQueryList queries={bdashQueries.map((query) => Object.assign(query, { user }))} />
        {!isPagerHidden && (
          <HStack marginTop={5} spacing={5}>
            <Button colorScheme="teal" disabled={page === 0} onClick={goToPreviousPage}>
              Previous
            </Button>
            <Button colorScheme="teal" disabled={!hasMore} onClick={goToNextPage}>
              Next
            </Button>
          </HStack>
        )}
      </ContentBox>
    </>
  );
}
