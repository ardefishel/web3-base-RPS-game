import type React from "react";
import { useMemo, useCallback } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { LobbyGrid } from "./LobbyGrid";
import { Button } from "./ui/button";
import { contractCall } from "../lib/abi/rpsgame.abi";

import {
  Transaction,
  TransactionButton,
} from "@coinbase/onchainkit/transaction";
import { useAccount, useChainId } from "wagmi";
import { useLobbies } from "@/lib/hooks/useLobbies";
import type { Lobby } from "./LobbyCard";

// Types for better type safety
type LobbySection = "my_in_progress" | "my_awaiting" | "public_available" | "completed" | "public_not_available"

interface LobbyWithSection extends Lobby {
  section: LobbySection;
}

interface SectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="space-y-2">
      <header className="space-y-1">
        <h3 className="text-sm font-medium text-pretty">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </header>
      {children}
      <Separator />
    </section>
  );
}

function categorizeLobby(lobby: Lobby, userAddress?: `0x${string}`): LobbySection {
  const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000" as const;
  const NO_MOVE = 0;
  
  const isUserInGame = lobby.player1 === userAddress || lobby.player2 === userAddress;
  
  if (isUserInGame) {
    if (lobby.move1 !== NO_MOVE && lobby.move2 !== NO_MOVE) {
      return "completed";
    } else if (
      lobby.player1 !== EMPTY_ADDRESS &&
      lobby.player2 !== EMPTY_ADDRESS
    ) {
      return "my_in_progress";
    } else {
      return "my_awaiting";
    }
  } else {
    return lobby.player2 === EMPTY_ADDRESS ? "public_available" : "public_not_available";
  }
}

export default function InGame() {
  const chainId = useChainId();
  const { address } = useAccount();
  const { lobbies, loading, refetchLobbies } = useLobbies();

  const createGameCall = useMemo(() => [contractCall("createGame")], []);

  const categorizedLobbies = useMemo((): LobbyWithSection[] => {
    return lobbies.map((lobby) => ({
      ...lobby,
      section: categorizeLobby(lobby, address),
    }));
  }, [lobbies, address]);

  const lobbyCategories = useMemo(() => {
    return {
      myInProgress: categorizedLobbies.filter(({ section }) => section === "my_in_progress"),
      myAwaiting: categorizedLobbies.filter(({ section }) => section === "my_awaiting"),
      publicAvailable: categorizedLobbies.filter(({ section }) => section === "public_available"),
      completed: categorizedLobbies.filter(({ section }) => section === "completed"),
    };
  }, [categorizedLobbies]);


  if (loading) {
    return (
      <main className="mx-auto w-full max-w-screen-sm p-4 space-y-4">
        <header className="space-y-1">
          <h1 className="text-lg font-semibold text-balance">Lobbies</h1>
          <p className="text-sm text-muted-foreground">Loading lobbies...</p>
        </header>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-screen-sm p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-lg font-semibold text-balance">Lobbies</h1>
        <p className="text-sm text-muted-foreground">
          Browse active battles and recently completed games.
        </p>
      </header>

      <Tabs defaultValue="active" className="w-full">
        <div className="w-full flex justify-between items-center gap-2">
          <TabsList
            aria-label="Lobby tabs"
            className="grid w-full flex-1 grid-cols-2"
          >
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Transaction
              onSuccess={refetchLobbies}
              calls={createGameCall}
              chainId={chainId}
            >
              <Button asChild variant="default" size="sm">
                <TransactionButton text="Add Game" />
              </Button>
            </Transaction>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          <Section 
            title="In Progress" 
            description="Your ongoing battles"
          >
            <LobbyGrid
              lobbies={lobbyCategories.myInProgress}
              emptyLabel="No games in progress"
            />
          </Section>
          
          <Section
            title="Awaiting Player"
            description="Your games waiting for opponents"
          >
            <LobbyGrid
              lobbies={lobbyCategories.myAwaiting}
              emptyLabel="No games awaiting players"
            />
          </Section>
          
          <Section
            title="Public Lobbies"
            description="Open games available to join"
          >
            <LobbyGrid
              lobbies={lobbyCategories.publicAvailable}
              emptyLabel="No public lobbies available"
            />
          </Section>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          <Section
            title="Recently Completed"
            description="Your wins and losses from finished games"
          >
            <LobbyGrid
              lobbies={lobbyCategories.completed}
              emptyLabel="No completed games"
            />
          </Section>
        </TabsContent>
      </Tabs>
    </main>
  );
}
