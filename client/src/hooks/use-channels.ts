import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useChannels(params?: { category?: string; country?: string; sortBy?: 'subscribers' | 'views' | 'growth'; limit?: number }) {
  return useQuery({
    queryKey: [api.channels.list.path, params],
    queryFn: async () => {
      const url = buildUrl(api.channels.list.path);
      const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      const fullUrl = queryString ? `${url}?${queryString}` : url;
      
      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error("Failed to fetch channels");
      return api.channels.list.responses[200].parse(await res.json());
    },
  });
}

export function useChannel(id: string) {
  return useQuery({
    queryKey: [api.channels.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.channels.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch channel");
      return api.channels.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useChannelStats(id: string) {
  return useQuery({
    queryKey: [api.channels.getStats.path, id],
    queryFn: async () => {
      const url = buildUrl(api.channels.getStats.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch channel stats");
      return api.channels.getStats.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
