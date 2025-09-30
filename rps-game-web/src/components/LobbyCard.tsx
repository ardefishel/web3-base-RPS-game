"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Link } from "@tanstack/react-router"

type ActiveStatus = "in_progress" | "awaiting_player" | "available"
type CompletedStatus = "win" | "lost"
export type LobbyStatus = ActiveStatus | CompletedStatus

export type Lobby = {
  id: string
  status: LobbyStatus
  player1: string;
  player2: string;
  move1:   number;
  move2:   number;
  winner:  string;
}

function statusToLabel(status: LobbyStatus) {
  switch (status) {
    case "in_progress":
      return "In Progress"
    case "awaiting_player":
      return "Awaiting Player"
    case "available":
      return "Available"
    case "win":
      return "Win"
    case "lost":
      return "Lost"
    default:
      return status
  }
}

function statusToBadgeVariant(status: LobbyStatus): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "in_progress":
      return "default"
    case "awaiting_player":
      return "secondary"
    case "available":
      return "outline"
    case "win":
      return "default"
    case "lost":
      return "destructive"
    default:
      return "secondary"
  }
}

export function LobbyCard({ lobby, className }: { lobby: Lobby; className?: string }) {
  return (
    <Link to="/battle/$id" params={{id: lobby.id}}>
      <Card
        role="article"
        aria-label={`Lobby ${lobby.id} by ${lobby.player1}, status ${statusToLabel(lobby.status)}`}
        className={cn(
          "bg-card text-card-foreground rounded-md p-2 hover:ring-1 hover:ring-ring focus-within:ring-1 focus-within:ring-ring transition",
          "min-h-20", // compact height
          className,
        )}
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-muted-foreground">#{lobby.id}</span>
            <Badge
              aria-label={`Status: ${statusToLabel(lobby.status)}`}
              variant={statusToBadgeVariant(lobby.status)}
              className="px-1.5 py-0 text-[10px]"
            >
              {statusToLabel(lobby.status)}
            </Badge>
          </div>
          <div className="text-xs truncate" title={`Host: ${lobby.player1}`}>
            Host: <span className="font-medium">{lobby.player1}</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
