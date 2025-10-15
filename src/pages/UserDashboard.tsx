import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLottery } from "@/contexts/LotteryContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TicketCard from "@/components/TicketCard";
import { toast } from "sonner";
import { ShoppingCart, Trophy, Ticket, CheckCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UserDashboard = () => {
  const location = useLocation();
  const { lotteries, buyTickets, walletBalance, purchasedTickets } = useLottery();
  const [selectedLotteryId, setSelectedLotteryId] = useState<string>("");
  const [selectedTickets, setSelectedTickets] = useState<number[]>([]);

  const activeLotteries = lotteries.filter((l) => l.active);
  const selectedLottery = lotteries.find((l) => l.id === selectedLotteryId);
  const totalCost = selectedTickets.length * (selectedLottery?.ticketPrice || 0);
  const myTickets = purchasedTickets.find((p) => p.lotteryId === selectedLotteryId);

  useEffect(() => {
    if (location.state?.lotteryId) {
      setSelectedLotteryId(location.state.lotteryId);
    } else if (activeLotteries.length > 0 && !selectedLotteryId) {
      setSelectedLotteryId(activeLotteries[0].id);
    }
  }, [location.state, activeLotteries, selectedLotteryId]);

  const handleToggleTicket = (ticketNumber: number) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketNumber)
        ? prev.filter((n) => n !== ticketNumber)
        : [...prev, ticketNumber]
    );
  };

  const handleBuyTickets = () => {
    if (selectedTickets.length === 0) {
      toast.error("Please select at least one ticket");
      return;
    }

    if (walletBalance < totalCost) {
      toast.error("Insufficient balance! Please add funds to your wallet.");
      return;
    }

    const success = buyTickets(selectedLotteryId, selectedTickets);
    if (success) {
      toast.success(`Successfully purchased ${selectedTickets.length} ticket(s)!`, {
        description: `Total cost: ${totalCost.toFixed(2)} ETH`,
        icon: <CheckCircle className="h-5 w-5" />,
      });
      setSelectedTickets([]);
    } else {
      toast.error("Failed to purchase tickets. Please try again.");
    }
  };

  if (activeLotteries.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Card className="p-8 text-center">
          <Trophy className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-bold text-foreground">No Active Lotteries</h2>
          <p className="text-muted-foreground">Check back soon for new lottery draws!</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Lottery Dashboard</h1>
          <p className="text-muted-foreground">
            Select your lucky tickets and join the draw
          </p>
        </div>

        {/* Lottery Selector */}
        <div className="mb-8">
          <label className="mb-2 block text-sm font-semibold text-foreground">
            Select Lottery
          </label>
          <Select value={selectedLotteryId} onValueChange={setSelectedLotteryId}>
            <SelectTrigger className="w-full border-primary/30 bg-card md:w-96">
              <SelectValue placeholder="Choose a lottery" />
            </SelectTrigger>
            <SelectContent>
              {activeLotteries.map((lottery) => (
                <SelectItem key={lottery.id} value={lottery.id}>
                  {lottery.name} - {lottery.ticketPrice} ETH per ticket
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedLottery && (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Tickets Grid */}
            <div className="lg:col-span-2">
              <Card className="border-border bg-card p-6">
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                  {selectedLottery.tickets.map((ticket) => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      selected={selectedTickets.includes(ticket.number)}
                      onToggle={() => handleToggleTicket(ticket.number)}
                    />
                  ))}
                </div>
              </Card>
            </div>

            {/* Purchase Summary */}
            <div className="space-y-6">
              <Card className="border-primary/30 bg-gradient-card p-6 shadow-glow-gold">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Purchase Summary
                </h3>
                <div className="space-y-4">
                  <div className="rounded-lg border border-border bg-background/50 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">Selected Tickets</p>
                    <p 
                      key={selectedTickets.length}
                      className="text-2xl font-bold text-foreground animate-scale-in"
                    >
                      {selectedTickets.length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/50 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">Total Cost</p>
                    <p 
                      key={totalCost}
                      className="text-2xl font-bold text-primary animate-scale-in"
                    >
                      {totalCost.toFixed(2)} ETH
                    </p>
                  </div>
                  <div className="rounded-lg border border-border bg-background/50 p-4">
                    <p className="mb-1 text-sm text-muted-foreground">Your Balance</p>
                    <p className="text-2xl font-bold text-foreground">
                      {walletBalance.toFixed(2)} ETH
                    </p>
                  </div>
                  <Button
                    onClick={handleBuyTickets}
                    disabled={selectedTickets.length === 0 || walletBalance < totalCost}
                    className="w-full bg-gradient-gold text-lg font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Buy {selectedTickets.length > 0 ? selectedTickets.length : ""} Ticket
                    {selectedTickets.length !== 1 ? "s" : ""}
                  </Button>
                </div>
              </Card>

              {/* My Tickets */}
              {myTickets && myTickets.ticketNumbers.length > 0 && (
                <Card className="border-secondary/30 bg-card p-6">
                  <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-foreground">
                    <Trophy className="h-5 w-5 text-secondary" />
                    My Tickets
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {myTickets.ticketNumbers.map((num) => (
                      <div
                        key={num}
                        className="flex h-12 w-12 items-center justify-center rounded-lg border border-secondary/30 bg-secondary/10 font-bold text-secondary"
                      >
                        #{num}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    You own {myTickets.ticketNumbers.length} ticket(s) in this lottery
                  </p>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
