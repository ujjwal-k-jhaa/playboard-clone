import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSuperChatRankings, useGrowthRankings } from "@/hooks/use-rankings";
import { Loader2, DollarSign, Users } from "lucide-react";
import { Link } from "wouter";

export default function Rankings() {
  const { data: scData, isLoading: scLoading } = useSuperChatRankings({ limit: 20, period: 'weekly' });
  const { data: growthData, isLoading: growthLoading } = useGrowthRankings({ limit: 20, period: 'weekly' });

  return (
    <div className="flex h-screen bg-background font-sans">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-display font-bold">Global Rankings</h1>
              <p className="text-muted-foreground">The world's top performing creators tracked in real-time.</p>
            </div>

            <Tabs defaultValue="superchat" className="w-full">
              <div className="flex items-center justify-between mb-6">
                <TabsList className="bg-muted p-1">
                  <TabsTrigger value="superchat" className="gap-2 px-4 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                    <DollarSign className="w-4 h-4" /> Super Chat
                  </TabsTrigger>
                  <TabsTrigger value="growth" className="gap-2 px-4 data-[state=active]:bg-card data-[state=active]:shadow-sm">
                    <Users className="w-4 h-4" /> Growth
                  </TabsTrigger>
                </TabsList>
                
                {/* Add filters here later (Country, Category dropdowns) */}
              </div>

              <TabsContent value="superchat" className="mt-0">
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  {scLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-muted/50 border-b border-border/50">
                        <tr>
                          <th className="px-6 py-4 font-medium text-muted-foreground text-sm w-20">Rank</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground text-sm">Channel</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground text-sm">Category</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground text-sm text-right">Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {scData?.map((item) => (
                          <tr key={item.channel.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-4">
                              <span className={`
                                inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                                ${item.rank <= 3 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}
                              `}>
                                {item.rank}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Link href={`/channel/${item.channel.id}`} className="flex items-center gap-4 group">
                                <img 
                                  src={item.channel.thumbnailUrl || ""} 
                                  alt={item.channel.title} 
                                  className="w-12 h-12 rounded-full border border-border group-hover:scale-105 transition-transform"
                                />
                                <div>
                                  <div className="font-bold text-foreground group-hover:text-primary transition-colors">{item.channel.title}</div>
                                  <div className="text-xs text-muted-foreground">{(item.channel.subscriberCount || 0).toLocaleString()} subscribers</div>
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground border border-border/50">
                                {item.channel.category || "General"}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                ${item.revenue.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="growth" className="mt-0">
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  {growthLoading ? (
                    <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                  ) : (
                    <table className="w-full text-left">
                      <thead className="bg-muted/50 border-b border-border/50">
                        <tr>
                          <th className="px-6 py-4 font-medium text-muted-foreground text-sm w-20">Rank</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground text-sm">Channel</th>
                          <th className="px-6 py-4 font-medium text-muted-foreground text-sm text-right">Subscribers Gained</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {growthData?.map((item) => (
                          <tr key={item.channel.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-4">
                              <span className={`
                                inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
                                ${item.rank <= 3 ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}
                              `}>
                                {item.rank}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <Link href={`/channel/${item.channel.id}`} className="flex items-center gap-4 group">
                                <img 
                                  src={item.channel.thumbnailUrl || ""} 
                                  alt={item.channel.title} 
                                  className="w-12 h-12 rounded-full border border-border group-hover:scale-105 transition-transform"
                                />
                                <div>
                                  <div className="font-bold text-foreground group-hover:text-primary transition-colors">{item.channel.title}</div>
                                  <div className="text-xs text-muted-foreground">{(item.channel.subscriberCount || 0).toLocaleString()} total</div>
                                </div>
                              </Link>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                                +{item.subscribersGained.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}
