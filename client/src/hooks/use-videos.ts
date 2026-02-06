import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useVideos(params?: { channelId?: string; isLive?: boolean; sortBy?: 'views' | 'likes' | 'revenue' | 'date'; limit?: number }) {
  return useQuery({
    queryKey: [api.videos.list.path, params],
    queryFn: async () => {
      const url = buildUrl(api.videos.list.path);
      const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
      const fullUrl = queryString ? `${url}?${queryString}` : url;

      const res = await fetch(fullUrl);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return api.videos.list.responses[200].parse(await res.json());
    },
  });
}

export function useVideo(id: string) {
  return useQuery({
    queryKey: [api.videos.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.videos.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch video");
      return api.videos.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
