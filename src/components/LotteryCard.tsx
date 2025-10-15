import { Calendar, Coins, Users, Trophy } from "lucide-react";
import { Lottery } from "@/contexts/LotteryContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface LotteryCardProps {
  lottery: Lottery;
}

const LotteryCard = ({ lottery }: LotteryCardProps) => {
  const navigate = useNavigate();
  const soldTickets = lottery.tickets.filter((t) => t.sold).length;
  const progress = (soldTickets / lottery.totalTickets) * 100;
  const prizePool = (soldTickets * lottery.ticketPrice).toFixed(2);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-gradient-card p-6 shadow-card transition-all hover:scale-105 hover:shadow-glow-gold">
      {/* Status Badge */}
      <div className="absolute right-4 top-4">
        {lottery.active ? (
          <span className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary animate-glow-pulse">
            ACTIVE
          </span>
        ) : lottery.winner ? (
          <span className="rounded-full bg-secondary/20 px-3 py-1 text-xs font-semibold text-secondary">
            COMPLETED
          </span>
        ) : (
          <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            CLOSED
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-2xl font-bold text-foreground">{lottery.name}</h3>
          <p className="text-sm text-muted-foreground">Lottery #{lottery.id.split("-")[1]}</p>
        </div>

        {/* Prize Pool */}
        <div className="flex items-center gap-2 rounded-lg bg-primary/10 p-3">
          <Trophy className="h-5 w-5 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Prize Pool</p>
            <p className="text-xl font-bold text-primary">{prizePool} ETH</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-lg bg-muted/50 p-3">
            <Coins className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">Ticket Price</p>
            <p className="font-semibold text-foreground">{lottery.ticketPrice} ETH</p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <Users className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">Sold</p>
            <p className="font-semibold text-foreground">
              {soldTickets}/{lottery.totalTickets}
            </p>
          </div>
          <div className="rounded-lg bg-muted/50 p-3">
            <Calendar className="mx-auto mb-1 h-4 w-4 text-primary" />
            <p className="text-xs text-muted-foreground">Deadline</p>
            <p className="text-xs font-semibold text-foreground">
              {new Date(lottery.deadline).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
       {/*  <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-gold transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div> */}

        {/* Winner Info */}
        {lottery.winner && (
          <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
            <p className="text-xs text-muted-foreground">Winner</p>
            <p className="font-mono text-sm font-semibold text-primary">
              Ticket #{lottery.winner.ticketNumber} - {lottery.winner.userId.substring(0, 10)}...
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Prize: {lottery.winner.prize.toFixed(2)} ETH
            </p>
          </div>
        )}

        {/* Action Button */}
        {lottery.active && (
          <Button
            onClick={() => navigate("/lottery", { state: { lotteryId: lottery.id } })}
            className="w-full bg-gradient-gold font-semibold text-primary-foreground hover:opacity-90"
          >
            Buy Tickets
          </Button>
        )}
      </div>
    </div>
  );
};

export default LotteryCard;
