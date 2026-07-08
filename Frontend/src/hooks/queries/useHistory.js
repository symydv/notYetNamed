import { useQuery } from "@tanstack/react-query";
import { historyQueryOptions } from "./historyQueryOptions";

export const useHistory = () => useQuery(historyQueryOptions());