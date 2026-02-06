import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth FIRST
  await setupAuth(app);
  registerAuthRoutes(app);

  // === Channels ===
  app.get(api.channels.list.path, async (req, res) => {
    const params = api.channels.list.input?.parse(req.query);
    const channels = await storage.getChannels(params);
    res.json(channels);
  });

  app.get(api.channels.get.path, async (req, res) => {
    const channel = await storage.getChannel(req.params.id);
    if (!channel) return res.status(404).json({ message: "Channel not found" });
    res.json(channel);
  });

  app.get(api.channels.getStats.path, async (req, res) => {
    const stats = await storage.getChannelStats(req.params.id);
    res.json(stats);
  });

  // === Videos ===
  app.get(api.videos.list.path, async (req, res) => {
    const params = api.videos.list.input?.parse(req.query);
    const videos = await storage.getVideos(params);
    res.json(videos);
  });

  app.get(api.videos.get.path, async (req, res) => {
    const video = await storage.getVideo(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  });

  // === Rankings ===
  app.get(api.rankings.superChat.path, async (req, res) => {
    const params = api.rankings.superChat.input?.parse(req.query);
    const rankings = await storage.getSuperChatRankings(params?.period, params?.limit);
    res.json(rankings);
  });

  app.get(api.rankings.growth.path, async (req, res) => {
    const params = api.rankings.growth.input?.parse(req.query);
    const rankings = await storage.getGrowthRankings(params?.period, params?.limit);
    res.json(rankings);
  });

  // Seed data on startup
  await storage.seedData();

  return httpServer;
}
