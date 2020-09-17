import { withUrqlClient } from "next-urql";
import { NavBar } from "../components/NavBar";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => {
  const [{data}] = usePostsQuery();
  
  return (
    <>
      <NavBar />
      {!data ? null : data.posts.map(p => <div key={p.id}>{p.title}</div>)}
    </>
  )
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index)
