import BattleGround from "@/components/BattleGround";
import type { Lobby } from "@/components/LobbyCard";
import { Button } from "@/components/ui/button";
import { RPS_ABI, RPS_ADDRESS } from "@/lib/abi/rpsgame.abi";
import { formatAddress } from "@/lib/utils";
import { Transaction, TransactionButton } from "@coinbase/onchainkit/transaction";
import { createFileRoute } from "@tanstack/react-router";
import { ContractFunctionParameters, createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { useAccount, useChainId } from "wagmi";

export const Route = createFileRoute("/battle/$id")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const publicClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
    });

    const gameData = (await publicClient.readContract({
      address: RPS_ADDRESS,
      abi: RPS_ABI,
      functionName: "getGame",
      args: [BigInt(params.id)],
    })) as unknown as Lobby;

    return {
      ...gameData,
      id: params.id,
    };
  },
});

function RouteComponent() {
  const gameData = Route.useLoaderData();
  const { address } = useAccount();

  const chainId = useChainId()

  const joinGameCall = [
    {
      address: RPS_ADDRESS,
      abi: RPS_ABI,
      functionName: "joinGame",
      args: [BigInt(gameData.id)],
    } as unknown as ContractFunctionParameters,
  ];

  return (
    <main className="mx-auto w-full max-w-screen-sm p-4 space-y-4">
      <header className="space-y-1 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-balance">
          Lobby #{gameData.id} | host: {formatAddress(gameData.player1)}
        </h1>
        {![gameData.player1, gameData.player2].includes(String(address)) && (
          <div>
            {/* <Button>Join</Button> */}
            <div>
            <Transaction calls={joinGameCall} chainId={chainId}>
              <Button asChild variant={"default"} size={"sm"}>
                <TransactionButton text="Join Game" />
              </Button>
            </Transaction>
          </div>
          </div>
        )}
      </header>
      <BattleGround gameData={gameData} />
    </main>
  );
}
