import React, { createContext, useContext, useState } from "react";

const LotteryContext = createContext(undefined);

// Mock initial data
const generateTickets = (count, price) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `ticket-${i + 1}`,
    number: i + 1,
    price,
    sold: Math.random() > 0.7, // 30% sold initially
  }));
};

const initialLotteries = [
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

export const LotteryProvider = ({ children }) => {
  const [lotteries, setLotteries] = useState(initialLotteries);
  const [walletBalance, setWalletBalance] = useState(10.0);
  const [currentUser] = useState("user-" + Math.random().toString(36).substr(2, 9));
  const [purchasedTickets, setPurchasedTickets] = useState([]);

  const createLottery = (lotteryData) => {
    const newLottery = {
      ...lotteryData,
      id: `lottery-${Date.now()}`,
      active: true,
      tickets: generateTickets(lotteryData.totalTickets, lotteryData.ticketPrice),
    };
    setLotteries((prev) => [newLottery, ...prev]);
  };

  const buyTickets = (lotteryId, ticketNumbers) => {
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

  const closeLottery = (lotteryId) => {
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

  const addFunds = (amount) => {
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
