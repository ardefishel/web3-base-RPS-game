

import type React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import type { Lobby } from "./LobbyCard"
import { LobbyGrid } from "./LobbyGrid"
import { Button } from "./ui/button"

import {PlusCircle} from 'lucide-react'

function Section({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-2">
      <header className="space-y-1">
        <h3 className="text-sm font-medium text-pretty">{title}</h3>
        {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}
      </header>
      {children}
      <Separator />
    </section>
  )
}

export default function InGame() {
  const inProgress: Lobby[] = [
    { id: "1024", status: "in_progress", host: "Aiden" },
    { id: "1025", status: "in_progress", host: "Riley" },
    { id: "1026", status: "in_progress", host: "Nova" },
    { id: "1027", status: "in_progress", host: "Kai" },
    { id: "1028", status: "in_progress", host: "Maya" },
    { id: "1029", status: "in_progress", host: "Leo" },
  ]

  const awaiting: Lobby[] = [
    { id: "2001", status: "awaiting_player", host: "Zoe" },
    { id: "2002", status: "awaiting_player", host: "Luca" },
    { id: "2003", status: "awaiting_player", host: "Ivy" },
    { id: "2004", status: "awaiting_player", host: "Owen" },
    { id: "2005", status: "awaiting_player", host: "Mila" },
    { id: "2006", status: "awaiting_player", host: "Eli" },
  ]

  const publicGround: Lobby[] = [
    { id: "3001", status: "available", host: "Sage" },
    { id: "3002", status: "available", host: "Noah" },
    { id: "3003", status: "available", host: "Layla" },
    { id: "3004", status: "available", host: "Aria" },
    { id: "3005", status: "available", host: "Theo" },
    { id: "3006", status: "available", host: "Jude" },
  ]

  const completed: Lobby[] = [
    { id: "5001", status: "win", host: "Aiden" },
    { id: "5002", status: "lost", host: "Riley" },
    { id: "5003", status: "win", host: "Nova" },
    { id: "5004", status: "lost", host: "Kai" },
    { id: "5005", status: "win", host: "Maya" },
    { id: "5006", status: "lost", host: "Leo" },
  ]

  return (
    <main className="mx-auto w-full max-w-screen-sm p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-lg font-semibold text-balance">Lobbies</h1>
        <p className="text-sm text-muted-foreground">Browse active battles and recently completed games.</p>
      </header>

      <Tabs defaultValue="active" className="w-full">
        <div className="w-full flex justify-between items-center gap-2">
        <TabsList aria-label="Lobby tabs" className="grid w-full flex-1 grid-cols-2">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        <Button variant={"default"} size={"sm"}><PlusCircle/> New Game</Button>
        </div>

        <TabsContent value="active" className="space-y-4">
          <Section title="In Progress Battle" description="Ongoing matches you can spectate or track.">
            <LobbyGrid lobbies={inProgress} emptyLabel="No battles in progress" />
          </Section>

          <Section title="Awaiting Player" description="Join a match that needs one more player.">
            <LobbyGrid lobbies={awaiting} emptyLabel="No lobbies awaiting players" />
          </Section>

          <Section title="Public Ground" description="Open lobbies available for anyone.">
            <LobbyGrid lobbies={publicGround} emptyLabel="No public lobbies available" />
          </Section>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Section title="Recently Completed" description="Your wins and losses from completed lobbies.">
            <LobbyGrid lobbies={completed} emptyLabel="No completed lobbies" />
          </Section>
        </TabsContent>
      </Tabs>
    </main>
  )
}
