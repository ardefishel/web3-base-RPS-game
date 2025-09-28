"use client"

import { cn } from "@/lib/utils"
import { LobbyCard } from "./LobbyCard"
import type {Lobby} from './LobbyCard'

export function LobbyGrid({
  lobbies,
  emptyLabel = "No lobbies",
  className,
}: {
  lobbies: Lobby[]
  emptyLabel?: string
  className?: string
}) {
  return (
    <div className={cn("w-full", className)}>
      {lobbies.length === 0 ? (
        <p className="text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {lobbies.map((lobby) => (
            <LobbyCard key={lobby.id} lobby={lobby} />
          ))}
        </div>
      )}
    </div>
  )
}
