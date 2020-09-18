import { Link } from "@chakra-ui/core";
import { withUrqlClient } from "next-urql";
import { Layout } from "../components/Layout";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";
import NextLink from 'next/link';

const Index = () => {
  const [{data}] = usePostsQuery();

  return (
    <Layout>
      <NavBar />
      <NextLink href="/create-post">
        <Link>
          create post
        </Link>
      </NextLink>
      {!data ? null : data.posts.map((p) => <div key={p.id}>{p.title}</div>)}
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
