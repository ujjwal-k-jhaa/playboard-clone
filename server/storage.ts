import { db } from "./db";
import {
  channels,
  videos,
  dailyStats,
  type Channel,
  type Video,
  type DailyStat,
  type InsertChannel,
  type InsertVideo,
  type ChannelQueryParams,
  type VideoQueryParams
} from "@shared/schema";
import { eq, desc, asc, and, gte, sql } from "drizzle-orm";

// Re-export auth storage
export { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage {
  // Channels
  getChannels(params?: ChannelQueryParams): Promise<Channel[]>;
  getChannel(id: string): Promise<Channel | undefined>;
  createChannel(channel: InsertChannel): Promise<Channel>;
  getChannelStats(channelId: string): Promise<DailyStat[]>;

  // Videos
  getVideos(params?: VideoQueryParams): Promise<(Video & { channel: Channel })[]>;
  getVideo(id: string): Promise<(Video & { channel: Channel }) | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;

  // Rankings
  getSuperChatRankings(period?: string, limit?: number): Promise<{ rank: number; channel: Channel; revenue: number }[]>;
  getGrowthRankings(period?: string, limit?: number): Promise<{ rank: number; channel: Channel; subscribersGained: number }[]>;

  // Seeding/Internal
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // === Channels ===
  async getChannels(params?: ChannelQueryParams): Promise<Channel[]> {
    let query = db.select().from(channels);

    if (params?.category) {
      query.where(eq(channels.category, params.category));
    }
    if (params?.country) {
      query.where(eq(channels.country, params.country));
    }

    if (params?.sortBy === 'views') {
      query.orderBy(desc(channels.viewCount));
    } else if (params?.sortBy === 'subscribers') {
      query.orderBy(desc(channels.subscriberCount));
    } else {
      query.orderBy(desc(channels.subscriberCount)); // Default
    }

    if (params?.limit) {
      query.limit(params.limit);
    }

    return await query;
  }

  async getChannel(id: string): Promise<Channel | undefined> {
    const [channel] = await db.select().from(channels).where(eq(channels.id, id));
    return channel;
  }

  async createChannel(insertChannel: InsertChannel): Promise<Channel> {
    const [channel] = await db.insert(channels).values(insertChannel).onConflictDoUpdate({
        target: channels.id,
        set: insertChannel
    }).returning();
    return channel;
  }

  async getChannelStats(channelId: string): Promise<DailyStat[]> {
    return await db.select()
      .from(dailyStats)
      .where(eq(dailyStats.channelId, channelId))
      .orderBy(asc(dailyStats.date));
  }

  // === Videos ===
  async getVideos(params?: VideoQueryParams): Promise<(Video & { channel: Channel })[]> {
    let query = db.select({
      video: videos,
      channel: channels
    })
    .from(videos)
    .innerJoin(channels, eq(videos.channelId, channels.id));

    const conditions = [];
    if (params?.channelId) conditions.push(eq(videos.channelId, params.channelId));
    if (params?.isLive !== undefined) conditions.push(eq(videos.isLive, params.isLive));
    
    if (conditions.length > 0) {
      query.where(and(...conditions));
    }

    if (params?.sortBy === 'views') {
      query.orderBy(desc(videos.viewCount));
    } else if (params?.sortBy === 'revenue') {
      query.orderBy(desc(videos.superChatRevenue));
    } else if (params?.sortBy === 'likes') {
      query.orderBy(desc(videos.likeCount));
    } else {
      query.orderBy(desc(videos.publishedAt));
    }

    if (params?.limit) {
      query.limit(params.limit);
    }

    const results = await query;
    return results.map(r => ({ ...r.video, channel: r.channel }));
  }

  async getVideo(id: string): Promise<(Video & { channel: Channel }) | undefined> {
    const [result] = await db.select({
      video: videos,
      channel: channels
    })
    .from(videos)
    .innerJoin(channels, eq(videos.channelId, channels.id))
    .where(eq(videos.id, id));

    if (!result) return undefined;
    return { ...result.video, channel: result.channel };
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db.insert(videos).values(insertVideo).onConflictDoUpdate({
        target: videos.id,
        set: insertVideo
    }).returning();
    return video;
  }

  // === Rankings ===
  async getSuperChatRankings(period: string = 'all-time', limit: number = 10): Promise<{ rank: number; channel: Channel; revenue: number }[]> {
    // For simplicity in this demo, we'll aggregate from videos table or daily_stats
    // In a real app, you'd filter by date range. Here we'll just sum all revenue for 'all-time'
    // or simulate it.
    
    // Aggregate revenue from videos per channel
    const revenueQuery = await db.select({
      channelId: videos.channelId,
      totalRevenue: sql<number>`sum(${videos.superChatRevenue})`.mapWith(Number)
    })
    .from(videos)
    .groupBy(videos.channelId)
    .orderBy(desc(sql`sum(${videos.superChatRevenue})`))
    .limit(limit);

    const results = [];
    let rank = 1;
    for (const row of revenueQuery) {
      const channel = await this.getChannel(row.channelId);
      if (channel) {
        results.push({
          rank: rank++,
          channel,
          revenue: row.totalRevenue
        });
      }
    }
    return results;
  }

  async getGrowthRankings(period: string = 'weekly', limit: number = 10): Promise<{ rank: number; channel: Channel; subscribersGained: number }[]> {
    // Mock implementation for growth - just returns top subscribed channels for now
    // Real implementation would diff stats
    const topChannels = await this.getChannels({ sortBy: 'subscribers', limit });
    return topChannels.map((channel, index) => ({
      rank: index + 1,
      channel,
      subscribersGained: Math.floor(channel.subscriberCount ? channel.subscriberCount * 0.05 : 0) // Fake 5% growth
    }));
  }

  // === Seeding ===
  async seedData(): Promise<void> {
    const existing = await this.getChannels({ limit: 1 });
    if (existing.length > 0) return;

    console.log("Seeding database...");

    const channelsData: InsertChannel[] = [
      { id: "UC1", title: "PewDiePie", subscriberCount: 111000000, viewCount: 29000000000, country: "US", category: "Gaming", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=PewDiePie" },
      { id: "UC2", title: "MrBeast", subscriberCount: 200000000, viewCount: 35000000000, country: "US", category: "Entertainment", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=MrBeast" },
      { id: "UC3", title: "T-Series", subscriberCount: 250000000, viewCount: 230000000000, country: "IN", category: "Music", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=TSeries" },
      { id: "UC4", title: "Gawr Gura Ch. hololive-EN", subscriberCount: 4400000, viewCount: 350000000, country: "JP", category: "VTuber", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gura" },
      { id: "UC5", title: "Mori Calliope Ch. hololive-EN", subscriberCount: 2300000, viewCount: 200000000, country: "JP", category: "VTuber", thumbnailUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Calli" },
    ];

    for (const c of channelsData) {
      await this.createChannel(c);
    }

    // Seed Videos with Super Chat revenue
    const videosData: InsertVideo[] = [
      { id: "v1", channelId: "UC1", title: "Minecraft Part 1", viewCount: 5000000, likeCount: 200000, superChatRevenue: 50000, publishedAt: new Date(), isLive: false, thumbnailUrl: "https://placehold.co/600x400?text=Minecraft" },
      { id: "v2", channelId: "UC2", title: "$1 vs $1,000,000 Hotel Room", viewCount: 100000000, likeCount: 4000000, superChatRevenue: 0, publishedAt: new Date(), isLive: false, thumbnailUrl: "https://placehold.co/600x400?text=Hotel" },
      { id: "v3", channelId: "UC4", title: "KARAOKE STREAM!", viewCount: 500000, likeCount: 50000, superChatRevenue: 1500000, publishedAt: new Date(), isLive: true, thumbnailUrl: "https://placehold.co/600x400?text=Karaoke" },
      { id: "v4", channelId: "UC5", title: "NEW ORIGINAL SONG MV", viewCount: 800000, likeCount: 80000, superChatRevenue: 800000, publishedAt: new Date(), isLive: false, thumbnailUrl: "https://placehold.co/600x400?text=Song" },
    ];

    for (const v of videosData) {
      await this.createVideo(v);
    }
    
    // Seed Daily Stats for charts
    // Generate 30 days of data for each channel
    const today = new Date();
    for (const c of channelsData) {
        let baseSubs = c.subscriberCount || 0;
        let baseViews = c.viewCount || 0;
        
        for (let i = 30; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            
            // Random variance
            const subChange = Math.floor(Math.random() * 10000) - 2000;
            const viewChange = Math.floor(Math.random() * 500000);
            
            await db.insert(dailyStats).values({
                channelId: c.id!,
                date: date.toISOString().split('T')[0], // YYYY-MM-DD
                subscribers: baseSubs - (subChange * i), // Backwards calculation simulation
                views: baseViews - (viewChange * i),
                revenue: Math.floor(Math.random() * 50000)
            });
        }
    }

    console.log("Seeding complete.");
  }
}

export const storage = new DatabaseStorage();
