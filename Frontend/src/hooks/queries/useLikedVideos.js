import { useInfiniteQuery } from "@tanstack/react-query"
import { getLikedVideos } from "../../api/likes"


export const useLikedVideos = ()=>{
  return useInfiniteQuery({
    queryKey: ["liked-videos"],
    queryFn: ({pageParam}) => getLikedVideos(pageParam),
    initialPageParam:1,
    getNextPageParam: (lastPage) => {
      return lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage+1 : undefined; //undefined=no more pages, stop
    }
  })
}