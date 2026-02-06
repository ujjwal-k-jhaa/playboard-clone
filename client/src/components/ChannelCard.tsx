import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Eye, Video } from "lucide-react";
import { type Channel } from "@shared/schema";

interface ChannelCardProps {
  channel: Channel;
  rank?: number;
}

export function ChannelCard({ channel, rank }: ChannelCardProps) {
  return (
    <Link href={`/channel/${channel.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20 group h-full">
        <CardContent className="p-5 flex flex-col items-center text-center gap-4 h-full relative">
          {rank && (
            <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center font-mono text-sm">
              #{rank}
            </div>
          )}
          
          <div className="relative mt-2">
            <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-primary to-accent overflow-hidden shadow-md group-hover:scale-105 transition-transform">
              <img 
                src={channel.thumbnailUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.title)}&background=random`} 
                alt={channel.title}
                className="w-full h-full rounded-full object-cover bg-card border-2 border-card"
              />
            </div>
          </div>
          
          <div className="space-y-1 w-full">
            <h3 className="font-bold text-lg truncate px-2 group-hover:text-primary transition-colors">{channel.title}</h3>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{channel.category || "Uncategorized"}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 w-full mt-auto pt-4 border-t border-border/50">
            <div className="flex flex-col items-center gap-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-mono font-semibold">{(channel.subscriberCount || 0).toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-mono font-semibold">{((channel.viewCount || 0) / 1000000).toFixed(1)}M</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Video className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-mono font-semibold">{channel.videoCount || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
