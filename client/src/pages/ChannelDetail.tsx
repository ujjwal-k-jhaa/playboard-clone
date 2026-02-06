import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useRoute } from "wouter";
import { useChannel, useChannelStats } from "@/hooks/use-channels";
import { useVideos } from "@/hooks/use-videos";
import { GrowthChart, RevenueChart } from "@/components/Charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "wouter";
import { Loader2, Users, Eye, Video, MapPin, Tag } from "lucide-react";

export default function ChannelDetail() {
  const [, params] = useRoute("/channel/:id");
  const channelId = params?.id || "";

  const { data: channel, isLoading: channelLoading } = useChannel(channelId);
  const { data: stats, isLoading: statsLoading } = useChannelStats(channelId);
  const { data: videos, isLoading: videosLoading } = useVideos({ channelId, limit: 6, sortBy: 'date' });

  if (channelLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!channel) {
    return <div className="p-8 text-center">Channel not found</div>;
  }

  return (
    <div className="flex h-screen bg-background font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {/* Header Profile */}
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 relative">
              {/* Optional Banner Image could go here */}
            </div>
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
                <img 
                  src={channel.thumbnailUrl || ""} 
                  alt={channel.title} 
                  className="w-32 h-32 rounded-full border-4 border-card bg-muted object-cover shadow-lg"
                />
                <div className="flex-1 space-y-2 mt-2 md:mt-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-3xl font-display font-bold">{channel.title}</h1>
                    {channel.country && (
                      <Badge variant="outline" className="gap-1 font-normal text-muted-foreground">
                        <MapPin className="w-3 h-3" /> {channel.country}
                      </Badge>
                    )}
                    {channel.category && (
                      <Badge variant="outline" className="gap-1 font-normal text-muted-foreground">
                        <Tag className="w-3 h-3" /> {channel.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {(channel.subscriberCount || 0).toLocaleString()} Subs</span>
                    <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {((channel.viewCount || 0) / 1000000).toFixed(1)}M Views</span>
                    <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> {channel.videoCount || 0} Videos</span>
                  </div>
                </div>
                <Button className="shrink-0 bg-[#FF0000] hover:bg-[#D40000] text-white rounded-full">
                  Subscribe on YouTube
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Channel Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="growth">
                    <TabsList className="mb-4">
                      <TabsTrigger value="growth">Subscriber Growth</TabsTrigger>
                      <TabsTrigger value="revenue">Revenue Estimate</TabsTrigger>
                    </TabsList>
                    <TabsContent value="growth" className="h-[300px]">
                      {statsLoading ? (
                        <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>
                      ) : (
                        <GrowthChart data={stats || []} />
                      )}
                    </TabsContent>
                    <TabsContent value="revenue" className="h-[300px]">
                      {statsLoading ? (
                        <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin" /></div>
                      ) : (
                        <RevenueChart data={stats || []} />
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Recent Videos */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-display font-bold">Recent Videos</h3>
                  <Button variant="ghost" size="sm">View all</Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos?.map((video) => (
                    <Link key={video.id} href={`/video/${video.id}`}>
                      <div className="group cursor-pointer bg-card rounded-lg overflow-hidden border border-border hover:shadow-md transition-all">
                        <div className="relative aspect-video bg-muted overflow-hidden">
                          <img 
                            src={video.thumbnailUrl || ""} 
                            alt={video.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                            12:45
                          </div>
                        </div>
                        <div className="p-3">
                          <h4 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h4>
                          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                            <span>{(video.viewCount || 0).toLocaleString()} views</span>
                            <span>{new Date(video.publishedAt || "").toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
                <CardContent className="text-sm text-muted-foreground space-y-4">
                  <p>
                    Data tracking started: {new Date(channel.updatedAt || Date.now()).toLocaleDateString()}
                  </p>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div>
                      <div className="text-xs font-medium uppercase text-muted-foreground">Country</div>
                      <div className="font-medium text-foreground">{channel.country || "Global"}</div>
                    </div>
                    <div>
                      <div className="text-xs font-medium uppercase text-muted-foreground">Category</div>
                      <div className="font-medium text-foreground">{channel.category || "General"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/10">
                <CardContent className="p-6">
                  <h4 className="font-bold text-lg mb-2 text-primary">Pro Analytics</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Unlock deep insights, audience demographics, and brand affinity data for {channel.title}.
                  </p>
                  <Button className="w-full font-semibold shadow-lg shadow-primary/20">
                    Upgrade to Pro
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
