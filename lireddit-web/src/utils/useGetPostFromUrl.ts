import { useRouter } from "next/router";
import { useGetIntId } from "./useGetIntId";

export const useGetPostFromUrl = () => {
  const IntId = useGetIntId();
  
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
}