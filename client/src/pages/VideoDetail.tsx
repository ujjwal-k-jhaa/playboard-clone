import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useRoute, Link } from "wouter";
import { useVideo } from "@/hooks/use-videos";
import { Loader2, ThumbsUp, MessageSquare, Eye, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function VideoDetail() {
  const [, params] = useRoute("/video/:id");
  const videoId = params?.id || "";
  const { data: video, isLoading } = useVideo(videoId);

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>;
  }

  if (!video) {
    return <div className="p-8">Video not found</div>;
  }

  return (
    <div className="flex h-screen bg-background font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Video Player Placeholder */}
              <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-2xl relative group">
                {/* Simulated YouTube Embed */}
                <img 
                  src={video.thumbnailUrl || ""} 
                  className="w-full h-full object-cover opacity-50 group-hover:opacity-40 transition-opacity" 
                  alt={video.title} 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-display font-bold mb-2">{video.title}</h1>
                <div className="flex items-center justify-between text-muted-foreground text-sm border-b border-border pb-4">
                  <span>Published on {new Date(video.publishedAt || "").toLocaleDateString()}</span>
                  <div className="flex gap-4">
                    <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> {(video.viewCount || 0).toLocaleString()}</span>
                    <span className="flex items-center gap-1.5"><ThumbsUp className="w-4 h-4" /> {(video.likeCount || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Link href={`/channel/${video.channel.id}`}>
                      <img 
                        src={video.channel.thumbnailUrl || ""} 
                        className="w-12 h-12 rounded-full border border-border cursor-pointer hover:opacity-80" 
                      />
                    </Link>
                    <div className="flex-1">
                      <Link href={`/channel/${video.channel.id}`} className="font-bold text-lg hover:text-primary transition-colors">
                        {video.channel.title}
                      </Link>
                      <div className="text-sm text-muted-foreground">{(video.channel.subscriberCount || 0).toLocaleString()} subscribers</div>
                    </div>
                    <Button variant="outline">View Channel</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card border-border shadow-sm">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-muted-foreground uppercase text-xs tracking-wider">Performance</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-xs font-medium">Est. Revenue</span>
                        </div>
                        <div className="text-xl font-mono font-bold text-emerald-600">
                          ${(video.superChatRevenue || 0).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2 text-muted-foreground mb-1">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-xs font-medium">Comments</span>
                        </div>
                        <div className="text-xl font-mono font-bold">
                          {(video.commentCount || 0).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {video.isLive && (
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-4 rounded-lg flex items-center gap-3">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                      <span className="text-red-700 dark:text-red-400 font-bold text-sm">Currently Live Streaming</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
