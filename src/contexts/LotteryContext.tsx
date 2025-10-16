import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Ticket {
  id: string;
  number: number;
  price: number;
  sold: boolean;
  owner?: string;
}

export interface Lottery {
  id: string;
  name: string;
  ticketPrice: number;
  totalTickets: number;
  deadline: string;
  active: boolean;
  tickets: Ticket[];
  winner?: {
    ticketNumber: number;
    userId: string;
    prize: number;
  };
}

interface LotteryContextType {
  lotteries: Lottery[];
  walletBalance: number;
  currentUser: string;
  purchasedTickets: { lotteryId: string; ticketNumbers: number[] }[];
  createLottery: (lottery: Omit<Lottery, "id" | "tickets" | "active">) => void;
  buyTickets: (lotteryId: string, ticketNumbers: number[]) => boolean;
  closeLottery: (lotteryId: string) => boolean;
  addFunds: (amount: number) => void;
}

const LotteryContext = createContext<LotteryContextType | undefined>(undefined);

// Mock initial data
const generateTickets = (count: number, price: number): Ticket[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ticket-${i + 1}`,
    number: i + 1,
    price,
    sold: Math.random() > 0.7, // 30% sold initially
  }));
};

const initialLotteries: Lottery[] = [
  {
    id: "lottery-1",
    name: "Golden Jackpot",
    ticketPrice: 0.1,
    totalTickets: 100,
    deadline: "2025-11-01T23:59:59",
    active: true,
    tickets: generateTickets(100, 0.1),
  },
  {
    id: "lottery-2",
    name: "Mega Fortune",
    ticketPrice: 0.5,
    totalTickets: 50,
    deadline: "2025-10-25T23:59:59",
    active: true,
    tickets: generateTickets(50, 0.5),
  },
];

export const LotteryProvider = ({ children }: { children: ReactNode }) => {
  const [lotteries, setLotteries] = useState<Lottery[]>(initialLotteries);
  const [walletBalance, setWalletBalance] = useState(10.0);
  const [currentUser] = useState("user-" + Math.random().toString(36).substr(2, 9));
  const [purchasedTickets, setPurchasedTickets] = useState<
    { lotteryId: string; ticketNumbers: number[] }[]
  >([]);

  const createLottery = (lotteryData: Omit<Lottery, "id" | "tickets" | "active">) => {
    const newLottery: Lottery = {
      ...lotteryData,
      id: `lottery-${Date.now()}`,
      active: true,
      tickets: generateTickets(lotteryData.totalTickets, lotteryData.ticketPrice),
    };
    setLotteries((prev) => [newLottery, ...prev]);
  };

  const buyTickets = (lotteryId: string, ticketNumbers: number[]): boolean => {
    const lottery = lotteries.find((l) => l.id === lotteryId);
    if (!lottery) return false;

    const totalCost = ticketNumbers.length * lottery.ticketPrice;
    if (walletBalance < totalCost) return false;

    setWalletBalance((prev) => prev - totalCost);
    setLotteries((prev) =>
      prev.map((l) =>
        l.id === lotteryId
          ? {
              ...l,
              tickets: l.tickets.map((t) =>
                ticketNumbers.includes(t.number)
                  ? { ...t, sold: true, owner: currentUser }
                  : t
              ),
            }
          : l
      )
    );

    setPurchasedTickets((prev) => {
      const existing = prev.find((p) => p.lotteryId === lotteryId);
      if (existing) {
        return prev.map((p) =>
          p.lotteryId === lotteryId
            ? { ...p, ticketNumbers: [...p.ticketNumbers, ...ticketNumbers] }
            : p
        );
      }
      return [...prev, { lotteryId, ticketNumbers }];
    });

    return true;
  };

  const closeLottery = (lotteryId: string): boolean => {
    const lottery = lotteries.find((l) => l.id === lotteryId);
    if (!lottery) return false;

    // Check for tickets that are both sold AND have an owner (actual participants)
    const soldTickets = lottery.tickets.filter((t) => t.sold && t.owner);
    
    // Check if there are at least 2 actual participants
    if (soldTickets.length < 2) {
      return false;
    }

    const winningTicket = soldTickets[Math.floor(Math.random() * soldTickets.length)];
    const prize = lottery.ticketPrice * soldTickets.length;

    setLotteries((prev) =>
      prev.map((l) =>
        l.id === lotteryId
          ? {
              ...l,
              active: false,
              winner: {
                ticketNumber: winningTicket.number,
                userId: winningTicket.owner || "unknown",
                prize,
              },
            }
          : l
      )
    );

    return true;
  };

  const addFunds = (amount: number) => {
    setWalletBalance((prev) => prev + amount);
  };

  return (
    <LotteryContext.Provider
      value={{
        lotteries,
        walletBalance,
        currentUser,
        purchasedTickets,
        createLottery,
        buyTickets,
        closeLottery,
        addFunds,
      }}
    >
      {children}
    </LotteryContext.Provider>
  );
};

export const useLottery = () => {
  const context = useContext(LotteryContext);
  if (!context) {
    throw new Error("useLottery must be used within a LotteryProvider");
  }
  return context;
};
