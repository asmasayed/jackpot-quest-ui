import { Ticket } from "lucide-react";
import { Ticket as TicketType } from "@/contexts/LotteryContext";
import { cn } from "@/lib/utils";

interface TicketCardProps {
  ticket: TicketType;
  selected?: boolean;
  onToggle?: () => void;
}

const TicketCard = ({ ticket, selected, onToggle }: TicketCardProps) => {
  const isDisabled = ticket.sold;

  return (
    <button
      onClick={() => !isDisabled && onToggle?.()}
      disabled={isDisabled}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-lg border p-4 transition-all",
        isDisabled && "cursor-not-allowed opacity-50",
        !isDisabled && "hover:scale-105 hover:shadow-glow-gold",
        selected && !isDisabled && "border-primary bg-primary/10 shadow-glow-gold",
        !selected && !isDisabled && "border-border bg-card hover:border-primary/50",
        isDisabled && "border-muted bg-muted/20"
      )}
    >
      {/* Ticket Icon */}
      <Ticket
        className={cn(
          "mb-2 h-8 w-8 transition-colors",
          selected && !isDisabled && "text-primary",
          !selected && !isDisabled && "text-muted-foreground group-hover:text-primary",
          isDisabled && "text-muted-foreground"
        )}
      />

      {/* Ticket Number */}
      <div className="text-center">
        <p className="text-2xl font-bold text-foreground">#{ticket.number}</p>
        <p className="text-xs text-muted-foreground">
          {isDisabled ? "SOLD" : `${ticket.price} ETH`}
        </p>
      </div>

      {/* Selected Badge */}
      {selected && !isDisabled && (
        <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          ✓
        </div>
      )}
    </button>
  );
};

export default TicketCard;
