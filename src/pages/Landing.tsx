import { useNavigate } from "react-router-dom";
import { useLottery } from "@/contexts/LotteryContext";
import { Button } from "@/components/ui/button";
import LotteryCard from "@/components/LotteryCard";
import { Trophy, Zap, Shield, Sparkles } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();
  const { lotteries } = useLottery();
  
  const activeLotteries = lotteries.filter((l) => l.active);
  const completedLotteries = lotteries.filter((l) => !l.active && l.winner);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Decentralized Lottery Platform
            </div>
            <h1 className="text-5xl font-bold leading-tight text-foreground md:text-7xl">
              Win Big with{" "}
              <span className="bg-gradient-gold bg-clip-text text-transparent animate-shine bg-[length:200%_auto]">
                LuckyChain
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Fair, transparent, and provably random blockchain lottery. Buy tickets, join the
              draw, and win massive prizes!
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <Button
                onClick={() => navigate("/lottery")}
                size="lg"
                className="bg-gradient-gold px-8 text-lg font-semibold text-primary-foreground hover:opacity-90"
              >
                Participate Now
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-4xl font-bold text-foreground">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-xl border border-border bg-card p-6 text-center transition-all hover:scale-105 hover:border-primary/50">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold">
                <Trophy className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Choose Lottery</h3>
              <p className="text-muted-foreground">
                Browse active lotteries and select the one with the prize pool that excites you
              </p>
            </div>
            <div className="group rounded-xl border border-border bg-card p-6 text-center transition-all hover:scale-105 hover:border-primary/50">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-purple">
                <Zap className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Buy Tickets</h3>
              <p className="text-muted-foreground">
                Select your lucky numbers and purchase tickets instantly with your wallet
              </p>
            </div>
            <div className="group rounded-xl border border-border bg-card p-6 text-center transition-all hover:scale-105 hover:border-primary/50">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-gold">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-foreground">Win Prizes</h3>
              <p className="text-muted-foreground">
                Wait for the draw and if you win, prizes are automatically transferred to your wallet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Active Lotteries */}
      <section className="border-b border-border py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-4xl font-bold text-foreground">Active Lotteries</h2>
          {activeLotteries.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activeLotteries.map((lottery) => (
                <LotteryCard key={lottery.id} lottery={lottery} />
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">No active lotteries at the moment.</p>
          )}
        </div>
      </section>

      {/* Recent Winners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-4xl font-bold text-foreground">Recent Winners</h2>
          {completedLotteries.length > 0 ? (
            <div className="space-y-4">
              {completedLotteries.slice(0, 5).map((lottery) => (
                <div
                  key={lottery.id}
                  className="flex items-center justify-between rounded-xl border border-primary/30 bg-card p-6 shadow-card"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold">
                      <Trophy className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{lottery.name}</p>
                      <p className="font-mono text-sm text-muted-foreground">
                        {lottery.winner?.userId.substring(0, 16)}...
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Won</p>
                    <p className="text-2xl font-bold text-primary">
                      {lottery.winner?.prize.toFixed(2)} ETH
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              No winners yet. Be the first to win!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Landing;
