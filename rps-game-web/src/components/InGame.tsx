import type React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import type { Lobby } from "./LobbyCard";
import { LobbyGrid } from "./LobbyGrid";
import { Button } from "./ui/button";
import { RPS_ABI, RPS_ADDRESS } from "../lib/abi/rpsgame.abi";

import {
  Transaction,
  TransactionButton,
} from "@coinbase/onchainkit/transaction";
import { useChainId, useReadContract, useReadContracts } from "wagmi";
import { ContractFunctionParameters } from "viem";
import { useMemo } from "react";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <header className="space-y-1">
        <h3 className="text-sm font-medium text-pretty">{title}</h3>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </header>
      {children}
      <Separator />
    </section>
  );
}

// dummy data
// const inProgress: Lobby[] = [
//   { id: "1024", status: "in_progress", host: "Aiden" },
//   { id: "1025", status: "in_progress", host: "Riley" },
//   { id: "1026", status: "in_progress", host: "Nova" },
//   { id: "1027", status: "in_progress", host: "Kai" },
//   { id: "1028", status: "in_progress", host: "Maya" },
//   { id: "1029", status: "in_progress", host: "Leo" },
// ];

// const awaiting: Lobby[] = [
//   { id: "2001", status: "awaiting_player", host: "Zoe" },
//   { id: "2002", status: "awaiting_player", host: "Luca" },
//   { id: "2003", status: "awaiting_player", host: "Ivy" },
//   { id: "2004", status: "awaiting_player", host: "Owen" },
//   { id: "2005", status: "awaiting_player", host: "Mila" },
//   { id: "2006", status: "awaiting_player", host: "Eli" },
// ];

// const publicGround: Lobby[] = [
//   { id: "3001", status: "available", host: "Sage" },
//   { id: "3002", status: "available", host: "Noah" },
//   { id: "3003", status: "available", host: "Layla" },
//   { id: "3004", status: "available", host: "Aria" },
//   { id: "3005", status: "available", host: "Theo" },
//   { id: "3006", status: "available", host: "Jude" },
// ];

// const completed: Lobby[] = [
//   { id: "5001", status: "win", host: "Aiden" },
//   { id: "5002", status: "lost", host: "Riley" },
//   { id: "5003", status: "win", host: "Nova" },
//   { id: "5004", status: "lost", host: "Kai" },
//   { id: "5005", status: "win", host: "Maya" },
//   { id: "5006", status: "lost", host: "Leo" },
// ];

export default function InGame() {
  const chainId = useChainId();
  const lobbies = useAllLobby();

  console.log({lobbies})

  //inprogress
  //awaiting
  //public

  const createGameCall = [
    {
      address: RPS_ADDRESS,
      abi: RPS_ABI,
      functionName: "createGame",
      args: [],
    } as unknown as ContractFunctionParameters,
  ];

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
          <div>
            <Transaction calls={createGameCall} chainId={chainId}>
              <Button asChild variant={"default"} size={"sm"}>
                <TransactionButton text="Add Game" />
              </Button>
            </Transaction>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          {/* <Section
            title="In Progress Battle"
            description="Ongoing matches you can spectate or track."
          >
            <LobbyGrid
              lobbies={inProgress}
              emptyLabel="No battles in progress"
            />
          </Section>

          <Section
            title="Awaiting Player"
            description="Join a match that needs one more player."
          >
            <LobbyGrid
              lobbies={awaiting}
              emptyLabel="No lobbies awaiting players"
            />
          </Section>
*/}
          <Section
            title="Public Ground"
            description="Open lobbies available for anyone."
          >
            <LobbyGrid
              lobbies={lobbies}
              emptyLabel="No public lobbies available"
            />
          </Section> 
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {/* <Section
            title="Recently Completed"
            description="Your wins and losses from completed lobbies."
          >
            <LobbyGrid lobbies={completed} emptyLabel="No completed lobbies" />
          </Section> */}
        </TabsContent>
      </Tabs>
    </main>
  );
}

const useAllLobby = (): Lobby[] => {
  const { data: gameCounter } = useReadContract({
    address: RPS_ADDRESS,
    abi: RPS_ABI,
    functionName: "gameCounter",
  });

  const allGameCalls = useMemo(() => {
    const total = Number(gameCounter ?? 0n);
    if (total <= 0) return [];

    return Array.from({ length: total }, (_, i) => ({
      address: RPS_ADDRESS,
      abi: RPS_ABI,
      functionName: "getGame",
      args: [BigInt(i + 1)],
    })) as unknown as ContractFunctionParameters[];
  }, [gameCounter]);

  const { data } = useReadContracts({
    contracts: allGameCalls,
  });

  if (!data) return [];

  return data
    .map((item, index) => {
      if (item.status !== "success" || !item.result) return null;

      const result = item.result as unknown as {
        player1: `0x${string}`;
        player2: `0x${string}`;
        move1: number;
        move2: number;
        status: number; // 0 Waiting, 1 Ongoing, 2 Finished
        winner: `0x${string}`;
      };

      const toLobbyStatus = (s: number): Lobby["status"] => {
        if (s === 0) return "awaiting_player";
        if (s === 1) return "in_progress";
        return "win"; // finished; winner presence not used here
      };

      const lobby: Lobby = {
        id: String(index + 1),
        status: toLobbyStatus(result.status),
        player1: result.player1,
        player2: result.player2,
        move1: Number(result.move1 ?? 0),
        move2: Number(result.move2 ?? 0),
        winner: result.winner,
      };

      return lobby;
    })
    .filter((x): x is Lobby => x !== null);
};
