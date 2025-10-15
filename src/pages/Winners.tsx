import { useLottery } from "@/contexts/LotteryContext";
import { Card } from "@/components/ui/card";
import { Trophy, Calendar, Coins, Ticket } from "lucide-react";

const Winners = () => {
  const { lotteries } = useLottery();
  const completedLotteries = lotteries.filter((l) => !l.active && l.winner);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2">
            <Trophy className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold text-primary">Hall of Winners</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
            Recent Winners
          </h1>
          <p className="text-xl text-muted-foreground">
            Congratulations to our lucky winners!
          </p>
        </div>

        {completedLotteries.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {completedLotteries.map((lottery) => (
              <Card
                key={lottery.id}
                className="group overflow-hidden border-primary/30 bg-gradient-card p-6 shadow-card transition-all hover:scale-105 hover:shadow-glow-gold"
              >
                {/* Winner Badge */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-gold animate-glow-pulse">
                    <Trophy className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                    WINNER
                  </span>
                </div>

                {/* Lottery Info */}
                <div className="mb-4">
                  <h3 className="mb-1 text-2xl font-bold text-foreground">{lottery.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Lottery #{lottery.id.split("-")[1]}
                  </p>
                </div>

                {/* Prize Amount */}
                <div className="mb-4 rounded-lg border border-primary/30 bg-primary/10 p-4">
                  <p className="mb-1 text-sm text-muted-foreground">Prize Won</p>
                  <p className="text-3xl font-bold text-primary">
                    {lottery.winner?.prize.toFixed(2)} ETH
                  </p>
                </div>

                {/* Winner Details */}
                <div className="space-y-3 rounded-lg border border-border bg-background/50 p-4">
                  <div className="flex items-center gap-3">
                    <Ticket className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Winning Ticket</p>
                      <p className="font-mono text-sm font-semibold text-foreground">
                        #{lottery.winner?.ticketNumber}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Trophy className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Winner ID</p>
                      <p className="font-mono text-xs font-semibold text-foreground">
                        {lottery.winner?.userId.substring(0, 20)}...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lottery Stats */}
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-muted/30 p-2">
                    <Coins className="mx-auto mb-1 h-3 w-3 text-primary" />
                    <p className="text-xs text-muted-foreground">Ticket Price</p>
                    <p className="text-sm font-semibold text-foreground">
                      {lottery.ticketPrice} ETH
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-2">
                    <Ticket className="mx-auto mb-1 h-3 w-3 text-primary" />
                    <p className="text-xs text-muted-foreground">Total Tickets</p>
                    <p className="text-sm font-semibold text-foreground">
                      {lottery.totalTickets}
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-2">
                    <Calendar className="mx-auto mb-1 h-3 w-3 text-primary" />
                    <p className="text-xs text-muted-foreground">Ended</p>
                    <p className="text-xs font-semibold text-foreground">
                      {new Date(lottery.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="mx-auto max-w-md p-12 text-center">
            <Trophy className="mx-auto mb-4 h-20 w-20 text-muted-foreground" />
            <h2 className="mb-2 text-2xl font-bold text-foreground">No Winners Yet</h2>
            <p className="text-muted-foreground">
              Be the first to win! Join an active lottery and try your luck.
            </p>
          </Card>
        )}

        {/* Stats Summary */}
        {completedLotteries.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-center text-2xl font-bold text-foreground">
              Platform Statistics
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-primary/30 bg-card p-6 text-center">
                <Trophy className="mx-auto mb-3 h-10 w-10 text-primary" />
                <p className="mb-1 text-3xl font-bold text-foreground">
                  {completedLotteries.length}
                </p>
                <p className="text-sm text-muted-foreground">Total Lotteries Completed</p>
              </Card>
              <Card className="border-primary/30 bg-card p-6 text-center">
                <Coins className="mx-auto mb-3 h-10 w-10 text-primary" />
                <p className="mb-1 text-3xl font-bold text-primary">
                  {completedLotteries
                    .reduce((sum, l) => sum + (l.winner?.prize || 0), 0)
                    .toFixed(2)}{" "}
                  ETH
                </p>
                <p className="text-sm text-muted-foreground">Total Prizes Distributed</p>
              </Card>
              <Card className="border-primary/30 bg-card p-6 text-center">
                <Ticket className="mx-auto mb-3 h-10 w-10 text-primary" />
                <p className="mb-1 text-3xl font-bold text-foreground">
                  {completedLotteries.reduce(
                    (sum, l) => sum + l.tickets.filter((t) => t.sold).length,
                    0
                  )}
                </p>
                <p className="text-sm text-muted-foreground">Total Tickets Sold</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Winners;
