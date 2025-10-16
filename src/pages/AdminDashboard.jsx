import { useState } from "react";
import { useLottery } from "@/contexts/LotteryContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trophy, Users, Lock, CheckCircle } from "lucide-react";
import LotteryCard from "@/components/LotteryCard";

const AdminDashboard = () => {
  const { lotteries, createLottery, closeLottery } = useLottery();
  const [formData, setFormData] = useState({
    name: "",
    ticketPrice: "",
    totalTickets: "",
    deadline: "",
  });

  const activeLotteries = lotteries.filter((l) => l.active);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ticketPrice || !formData.totalTickets || !formData.deadline) {
      toast.error("Please fill in all fields");
      return;
    }

    createLottery({
      name: formData.name,
      ticketPrice: parseFloat(formData.ticketPrice),
      totalTickets: parseInt(formData.totalTickets),
      deadline: formData.deadline,
    });

    toast.success("Lottery created successfully!", {
      description: `${formData.name} is now live`,
      icon: <CheckCircle className="h-5 w-5" />,
    });

    setFormData({ name: "", ticketPrice: "", totalTickets: "", deadline: "" });
  };

  const handleCloseLottery = (lotteryId) => {
    const success = closeLottery(lotteryId);
    
    if (success) {
      toast.success("Lottery closed and winner selected!", {
        description: "Check the lottery card for winner details",
        icon: <Trophy className="h-5 w-5" />,
      });
    } else {
      toast.error("Cannot close lottery yet!", {
        description: "At least 2 participants are required to draw a winner",
        icon: <Users className="h-5 w-5" />,
      });
    }
  };

  const getLotteryParticipants = (lotteryId) => {
    const lottery = lotteries.find((l) => l.id === lotteryId);
    if (!lottery) return [];
    
    const participants = new Map();
    lottery.tickets.forEach((ticket) => {
      if (ticket.sold && ticket.owner) {
        participants.set(ticket.owner, (participants.get(ticket.owner) || 0) + 1);
      }
    });
    
    return Array.from(participants.entries()).map(([userId, count]) => ({
      userId,
      ticketCount: count,
    }));
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Create and manage lotteries</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Create Lottery Form */}
          <div className="lg:col-span-1">
            <Card className="border-primary/30 bg-gradient-card p-6 shadow-glow-gold">
              <h2 className="mb-6 flex items-center gap-2 text-2xl font-bold text-foreground">
                <Plus className="h-6 w-6 text-primary" />
                Create Lottery
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Lottery Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Golden Jackpot"
                    className="border-border bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="ticketPrice">Ticket Price (ETH)</Label>
                  <Input
                    id="ticketPrice"
                    type="number"
                    step="0.01"
                    value={formData.ticketPrice}
                    onChange={(e) => setFormData({ ...formData, ticketPrice: e.target.value })}
                    placeholder="0.1"
                    className="border-border bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="totalTickets">Total Tickets</Label>
                  <Input
                    id="totalTickets"
                    type="number"
                    value={formData.totalTickets}
                    onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                    placeholder="100"
                    className="border-border bg-background"
                  />
                </div>
                <div>
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="datetime-local"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="border-border bg-background"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-gold font-semibold text-primary-foreground hover:opacity-90"
                >
                  Create Lottery
                </Button>
              </form>
            </Card>
          </div>

          {/* Active Lotteries */}
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-2xl font-bold text-foreground">Active Lotteries</h2>
            {activeLotteries.length > 0 ? (
              <div className="space-y-6">
                {activeLotteries.map((lottery) => {
                  const participants = getLotteryParticipants(lottery.id);
                  const soldTickets = lottery.tickets.filter((t) => t.sold && t.owner).length;

                  return (
                    <Card key={lottery.id} className="border-border bg-card p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-foreground">{lottery.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Lottery #{lottery.id.split("-")[1]}
                          </p>
                        </div>
                        <Button
                          onClick={() => handleCloseLottery(lottery.id)}
                          disabled={soldTickets < 2}
                          className="bg-gradient-purple font-semibold text-secondary-foreground hover:opacity-90"
                        >
                          <Lock className="mr-2 h-4 w-4" />
                          Close & Draw Winner
                        </Button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Trophy className="h-5 w-5 text-primary" />
                            <p className="text-sm font-semibold text-foreground">Prize Pool</p>
                          </div>
                          <p className="text-2xl font-bold text-primary">
                            {(soldTickets * lottery.ticketPrice).toFixed(2)} ETH
                          </p>
                        </div>

                        <div className="rounded-lg border border-border bg-background/50 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-5 w-5 text-foreground" />
                            <p className="text-sm font-semibold text-foreground">Participants</p>
                          </div>
                          <p className="text-2xl font-bold text-foreground">
                            {participants.length} Users
                          </p>
                        </div>
                      </div>

                      {/* Participants Table */}
                      {participants.length > 0 && (
                        <div className="mt-4">
                          <h4 className="mb-3 font-semibold text-foreground">Participant List</h4>
                          <div className="max-h-64 overflow-y-auto rounded-lg border border-border">
                            <table className="w-full">
                              <thead className="bg-muted/50 text-left text-sm">
                                <tr>
                                  <th className="p-3">User ID</th>
                                  <th className="p-3">Tickets Owned</th>
                                  <th className="p-3">Total Spent</th>
                                </tr>
                              </thead>
                              <tbody className="text-sm">
                                {participants.map(({ userId, ticketCount }) => (
                                  <tr
                                    key={userId}
                                    className="border-t border-border hover:bg-muted/20"
                                  >
                                    <td className="p-3 font-mono text-xs">
                                      {userId.substring(0, 20)}...
                                    </td>
                                    <td className="p-3 font-semibold">{ticketCount}</td>
                                    <td className="p-3 text-primary">
                                      {(ticketCount * lottery.ticketPrice).toFixed(2)} ETH
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <Trophy className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-xl font-bold text-foreground">No Active Lotteries</h3>
                <p className="text-muted-foreground">Create a new lottery to get started</p>
              </Card>
            )}
          </div>
        </div>

        {/* Past Lotteries */}
        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Completed Lotteries</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lotteries
              .filter((l) => !l.active)
              .map((lottery) => (
                <LotteryCard key={lottery.id} lottery={lottery} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
