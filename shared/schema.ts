import { pgTable, text, serial, integer, boolean, timestamp, bigint, date, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Re-export auth models
export * from "./models/auth";

// === TABLE DEFINITIONS ===

export const channels = pgTable("channels", {
  id: text("id").primaryKey(), // YouTube Channel ID
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  subscriberCount: integer("subscriber_count").default(0),
  videoCount: integer("video_count").default(0),
  viewCount: bigint("view_count", { mode: "number" }).default(0),
  country: text("country"),
  category: text("category"), // e.g., "Gaming", "Music"
  isTracked: boolean("is_tracked").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: text("id").primaryKey(), // YouTube Video ID
  channelId: text("channel_id").notNull().references(() => channels.id),
  title: text("title").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  publishedAt: timestamp("published_at"),
  viewCount: bigint("view_count", { mode: "number" }).default(0),
  likeCount: integer("like_count").default(0),
  commentCount: integer("comment_count").default(0),
  superChatRevenue: integer("super_chat_revenue").default(0), // In USD cents for simplicity
  isLive: boolean("is_live").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dailyStats = pgTable("daily_stats", {
  id: serial("id").primaryKey(),
  channelId: text("channel_id").notNull().references(() => channels.id),
  date: date("date").notNull(),
  subscribers: integer("subscribers").default(0),
  views: bigint("views", { mode: "number" }).default(0),
  revenue: integer("revenue").default(0), // Daily Super Chat revenue
});

// === RELATIONS ===

export const channelsRelations = relations(channels, ({ many }) => ({
  videos: many(videos),
  dailyStats: many(dailyStats),
}));

export const videosRelations = relations(videos, ({ one }) => ({
  channel: one(channels, {
    fields: [videos.channelId],
    references: [channels.id],
  }),
}));

export const dailyStatsRelations = relations(dailyStats, ({ one }) => ({
  channel: one(channels, {
    fields: [dailyStats.channelId],
    references: [channels.id],
  }),
}));

// === BASE SCHEMAS ===

export const insertChannelSchema = createInsertSchema(channels);
export const insertVideoSchema = createInsertSchema(videos);
export const insertDailyStatsSchema = createInsertSchema(dailyStats).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===

export type Channel = typeof channels.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type DailyStat = typeof dailyStats.$inferSelect;

export type InsertChannel = z.infer<typeof insertChannelSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

// Responses
export type ChannelResponse = Channel;
export type VideoResponse = Video;
export type DailyStatResponse = DailyStat;

// Custom Responses for Aggregated Data
export type ChannelWithStats = Channel & {
  dailyStats: DailyStat[];
};

export type VideoWithChannel = Video & {
  channel: Channel;
};

// Query Params
export interface ChannelQueryParams {
  category?: string;
  country?: string;
  sortBy?: 'subscribers' | 'views' | 'growth';
  limit?: number;
}

export interface VideoQueryParams {
  channelId?: string;
  isLive?: boolean;
  sortBy?: 'views' | 'likes' | 'revenue' | 'date';
  limit?: number;
}

export interface RankingResponse {
  rank: number;
  channel: Channel;
  score: number; // Growth or Revenue score
}
