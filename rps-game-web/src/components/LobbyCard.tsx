"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatAddress } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useAccount } from "wagmi";

type ActiveStatus = "in_progress" | "awaiting_player" | "available";
type CompletedStatus = "win" | "lost" | "completed";
export type LobbyStatus = ActiveStatus | CompletedStatus;

export type Lobby = {
  id: string;
  status: LobbyStatus;
  player1: string;
  player2: string;
  move1: number;
  move2: number;
  winner: string;
};

function statusToLabel(lobby: Lobby, address: string = '') {
  switch (lobby.status) {
    case "in_progress":
      return "In Progress";
    case "awaiting_player":
      return "Awaiting Player";
    case "available":
      return "Available";
    case "completed":
      return lobby.winner == address ? "win" : "lost"
    default:
      return status;
  }
}

function statusToBadgeVariant(
  lobby: Lobby,
  address: string = ''
): "default" | "secondary" | "destructive" | "outline" {
  switch (lobby.status) {
    case "in_progress":
      return "default";
    case "awaiting_player":
      return "secondary";
    case "available":
      return "outline";
    case "completed":
      return lobby.winner == address ?  "default" : 'destructive'
    default:
      return "secondary";
  }
}

export function LobbyCard({
  lobby,
  className,
}: {
  lobby: Lobby;
  className?: string;
}) {

  const {address} = useAccount()
  return (
    <Link to="/battle/$id" params={{ id: lobby.id }}>
      <Card
        role="article"
        aria-label={`Lobby ${lobby.id} by ${lobby.player1}, status ${statusToLabel(lobby, address)}`}
        className={cn(
          "bg-card text-card-foreground rounded-md p-2 hover:ring-1 hover:ring-ring focus-within:ring-1 focus-within:ring-ring transition",
          "min-h-20", // compact height
          className
        )}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">
              #{lobby.id}
            </span>
            <Badge
              aria-label={`Status: ${statusToLabel(lobby, address)}`}
              variant={statusToBadgeVariant(lobby, address)}
              className="px-1.5 py-0 text-[10px]"
            >
              {statusToLabel(lobby, address)}
            </Badge>
          </div>
          <div
            className="text-xs truncate"
            title={`Host: ${formatAddress(lobby.player1)}`}
          >
            Host: <span className="font-medium">{formatAddress(lobby.player1,4)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
