import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLottery } from "@/contexts/LotteryContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ShoppingCart, Trophy, Ticket, CheckCircle, Plus, Minus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const UserDashboard = () => {
  const location = useLocation();
  const { lotteries, buyTickets, walletBalance, purchasedTickets } = useLottery();
  const [selectedLotteryId, setSelectedLotteryId] = useState("");
  const [selectedTickets, setSelectedTickets] = useState([]);

  const activeLotteries = lotteries.filter((l) => l.active);
  const selectedLottery = lotteries.find((l) => l.id === selectedLotteryId);
  const [ticketCount, setTicketCount] = useState(1);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const totalCost = ticketCount * (selectedLottery?.ticketPrice || 0);
  const myTickets = purchasedTickets.find((p) => p.lotteryId === selectedLotteryId);
  
  const availableTickets = selectedLottery?.tickets.filter(t => !t.sold).length || 0;

  useEffect(() => {
    if (location.state?.lotteryId) {
      setSelectedLotteryId(location.state.lotteryId);
    } else if (activeLotteries.length > 0 && !selectedLotteryId) {
      setSelectedLotteryId(activeLotteries[0].id);
    }
  }, [location.state, activeLotteries, selectedLotteryId]);

  const handleIncrement = () => {
    if (ticketCount < availableTickets) {
      setTicketCount(prev => prev + 1);
    }
  };

  const handleDecrement = () => {
    if (ticketCount > 1) {
      setTicketCount(prev => prev - 1);
    }
  };

  const handleBuyTickets = () => {
    if (ticketCount === 0) {
      toast.error("Please select at least one ticket");
      return;
    }

    if (walletBalance < totalCost) {
      toast.error("Insufficient balance! Please add funds to your wallet.");
      return;
    }

    // Show confirmation dialog if buying 1-2 tickets to encourage buying more
    if (ticketCount <= 2) {
      setShowConfirmDialog(true);
      return;
    }

    completePurchase();
  };

  const completePurchase = () => {
    // Get available ticket numbers
    const availableTicketNumbers = selectedLottery?.tickets
      .filter(t => !t.sold)
      .slice(0, ticketCount)
      .map(t => t.number) || [];

    const success = buyTickets(selectedLotteryId, availableTicketNumbers);
    if (success) {
      toast.success(`Successfully purchased ${ticketCount} ticket(s)!`, {
        description: `Total cost: ${totalCost.toFixed(2)} ETH`,
        icon: <CheckCircle className="h-5 w-5" />,
      });
      setTicketCount(1);
      setShowConfirmDialog(false);
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
            {/* Animated Ticket Selector */}
            <div className="lg:col-span-2">
              <Card className="border-border bg-card p-8">
                <div className="flex flex-col items-center justify-center space-y-8">
                  {/* Animated Ticket Icon */}
                  <div className="relative">
                    {Array.from({ length: Math.min(ticketCount, 5) }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "absolute flex items-center justify-center rounded-lg border-2 border-primary bg-primary/10 p-6 shadow-glow-gold transition-all duration-300",
                          "animate-scale-in"
                        )}
                        style={{
                          transform: `rotate(${i * 5}deg) translateY(${i * -4}px)`,
                          zIndex: 10 - i,
                          left: `${i * 2}px`,
                        }}
                      >
                        <Ticket className="h-16 w-16 text-primary" />
                      </div>
                    ))}
                    <div className="h-32 w-32" />
                  </div>

                  {/* Ticket Counter Display */}
                  <div className="text-center">
                    <p className="mb-2 text-sm text-muted-foreground">Number of Tickets</p>
                    <p
                      key={ticketCount}
                      className="text-6xl font-bold text-primary animate-scale-in"
                    >
                      {ticketCount}
                    </p>
                  </div>

                  {/* Increment/Decrement Controls */}
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={handleDecrement}
                      disabled={ticketCount <= 1}
                      size="lg"
                      variant="outline"
                      className="h-14 w-14 rounded-full border-primary/30 hover:bg-primary/10"
                    >
                      <Minus className="h-6 w-6" />
                    </Button>
                    <div className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-6 py-3">
                      <Ticket className="h-5 w-5 text-primary" />
                      <span className="text-sm font-semibold text-muted-foreground">
                        {availableTickets} available
                      </span>
                    </div>
                    <Button
                      onClick={handleIncrement}
                      disabled={ticketCount >= availableTickets}
                      size="lg"
                      className="h-14 w-14 rounded-full bg-gradient-gold hover:opacity-90"
                    >
                      <Plus className="h-6 w-6" />
                    </Button>
                  </div>
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
                      key={ticketCount}
                      className="text-2xl font-bold text-foreground animate-scale-in"
                    >
                      {ticketCount}
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
                    disabled={ticketCount === 0 || walletBalance < totalCost || availableTickets === 0}
                    className="w-full bg-gradient-gold text-lg font-semibold text-primary-foreground hover:opacity-90"
                  >
                    Buy {ticketCount} Ticket{ticketCount !== 1 ? "s" : ""}
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

        {/* Confirmation Dialog for Small Purchases */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="border-primary/30 bg-card">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-foreground">
                <Trophy className="h-5 w-5 text-primary" />
                Buying Only {ticketCount} Ticket{ticketCount !== 1 ? "s" : ""}?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                You're purchasing just {ticketCount} ticket{ticketCount !== 1 ? "s" : ""}. 
                Buying more tickets significantly increases your chances of winning the {selectedLottery?.name}!
                <br /><br />
                <span className="font-semibold text-primary">
                  💡 Tip: More tickets = Better odds of winning!
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
                Buy More Tickets
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={completePurchase}
                className="bg-gradient-gold text-primary-foreground hover:opacity-90"
              >
                Confirm Purchase
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserDashboard;
