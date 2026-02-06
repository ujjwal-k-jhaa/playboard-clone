import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useSuperChatRankings(params?: { period?: 'daily' | 'weekly' | 'monthly' | 'all-time'; limit?: number }) {
  return useQuery({
    queryKey: [api.rankings.superChat.path, params],
    queryFn: async () => {
      const url = buildUrl(api.rankings.superChat.path);
      const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error("Failed to fetch super chat rankings");
      return api.rankings.superChat.responses[200].parse(await res.json());
    },
  });
}

export function useGrowthRankings(params?: { period?: 'daily' | 'weekly' | 'monthly'; limit?: number }) {
  return useQuery({
    queryKey: [api.rankings.growth.path, params],
    queryFn: async () => {
      const url = buildUrl(api.rankings.growth.path);
      const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error("Failed to fetch growth rankings");
      return api.rankings.growth.responses[200].parse(await res.json());
    },
  });
}
