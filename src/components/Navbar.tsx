import { Link, useLocation } from "react-router-dom";
import { Home, Ticket, Shield, Trophy, Wallet } from "lucide-react";
import { useLottery } from "@/contexts/LotteryContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  const location = useLocation();
  const { walletBalance, addFunds } = useLottery();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-gold">
            <Trophy className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-gold bg-clip-text text-transparent">
            BetY
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`flex items-center gap-2 transition-colors ${
              isActive("/")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
          
          <Link
            to="/lottery"
            className={`flex items-center gap-2 transition-colors ${
              isActive("/lottery")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Ticket className="h-4 w-4" />
            <span className="hidden sm:inline">Lottery</span>
          </Link>
          
          <Link
            to="/winners"
            className={`flex items-center gap-2 transition-colors ${
              isActive("/winners")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span className="hidden sm:inline">Winners</span>
          </Link>
          
          <Link
            to="/admin"
            className={`flex items-center gap-2 transition-colors ${
              isActive("/admin")
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-card px-4 py-2 shadow-glow-gold">
            <Wallet className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              {walletBalance.toFixed(2)} ETH
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => addFunds(5)}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            Add Funds
          </Button>
          <ThemeToggle/>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
