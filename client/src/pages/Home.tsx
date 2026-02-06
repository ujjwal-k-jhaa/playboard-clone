import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useSuperChatRankings, useGrowthRankings } from "@/hooks/use-rankings";
import { useChannels } from "@/hooks/use-channels";
import { ChannelCard } from "@/components/ChannelCard";
import { StatCard } from "@/components/StatCard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { DollarSign, Trophy, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: superChatData, isLoading: scLoading } = useSuperChatRankings({ limit: 5, period: 'weekly' });
  const { data: growthData, isLoading: growthLoading } = useGrowthRankings({ limit: 5, period: 'weekly' });
  const { data: channelsData, isLoading: channelsLoading } = useChannels({ limit: 4, sortBy: 'views' });

  return (
    <div className="flex h-screen bg-background font-sans">
      <Sidebar />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8">
          {/* Hero Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
              title="Total Channels Tracked" 
              value="12.4M" 
              trend={{ value: 2.5, isPositive: true }}
              icon={<Trophy className="w-8 h-8 text-primary" />}
              subtitle="Updated 5 mins ago"
            />
            <StatCard 
              title="Daily Super Chat" 
              value="$1.2M" 
              trend={{ value: 12.1, isPositive: true }}
              icon={<DollarSign className="w-8 h-8 text-emerald-500" />}
              subtitle="Global revenue today"
            />
            <StatCard 
              title="Avg. Engagement" 
              value="8.4%" 
              trend={{ value: 0.8, isPositive: false }}
              icon={<TrendingUp className="w-8 h-8 text-accent" />}
              subtitle="Across top 1000 channels"
            />
          </div>

          {/* Super Chat Rankings Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-display font-bold">Super Chat Leaders</h2>
                <p className="text-muted-foreground">Top earning channels this week</p>
              </div>
              <Link href="/rankings/super-chat">
                <Button variant="outline" className="gap-2">
                  View All <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              {scLoading ? (
                <div className="p-8 flex justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Rank</th>
                        <th className="px-6 py-4">Channel</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4 text-right">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                      {superChatData?.map((item) => (
                        <tr key={item.channel.id} className="hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-mono font-medium text-muted-foreground">#{item.rank}</td>
                          <td className="px-6 py-4">
                            <Link href={`/channel/${item.channel.id}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                              <img 
                                src={item.channel.thumbnailUrl || ""} 
                                alt={item.channel.title}
                                className="w-10 h-10 rounded-full bg-muted object-cover border border-border"
                              />
                              <span className="font-semibold text-foreground">{item.channel.title}</span>
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                              {item.channel.category || "General"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            ${item.revenue.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>

          {/* Growth & Channels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Fast Growing */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Fastest Growing</h2>
                <Link href="/rankings/growth">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">See more</Button>
                </Link>
              </div>
              <Card className="flex-1">
                <CardContent className="p-0">
                  {growthLoading ? (
                    <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
                  ) : (
                    <div className="divide-y divide-border">
                      {growthData?.map((item) => (
                        <div key={item.channel.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <span className="w-6 text-center text-sm font-mono text-muted-foreground">#{item.rank}</span>
                            <img src={item.channel.thumbnailUrl || ""} className="w-8 h-8 rounded-full bg-muted object-cover" />
                            <Link href={`/channel/${item.channel.id}`} className="font-medium hover:text-primary transition-colors line-clamp-1">
                              {item.channel.title}
                            </Link>
                          </div>
                          <div className="flex items-center gap-1 text-emerald-600 font-mono text-sm">
                            <TrendingUp className="w-3 h-3" />
                            +{item.subscribersGained.toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            {/* Popular Channels */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Popular Now</h2>
                <Link href="/rankings/channels">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">See more</Button>
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {channelsLoading ? (
                  [...Array(4)].map((_, i) => (
                    <div key={i} className="h-48 bg-muted animate-pulse rounded-xl" />
                  ))
                ) : (
                  channelsData?.map((channel) => (
                    <ChannelCard key={channel.id} channel={channel} />
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
