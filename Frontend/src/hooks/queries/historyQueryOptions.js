import { queryOptions } from "@tanstack/react-query";
import { getHistory } from "../../api/history";

//this is just a config.
export const historyQueryOptions = () => {
  return queryOptions({
    queryKey: ["history"],
    queryFn: getHistory,
  })
}