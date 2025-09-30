import { useAccount, useChainId } from "wagmi";
import type { Lobby } from "./LobbyCard";
import { Button } from "./ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "./ui/card";
import { formatAddress } from "@/lib/utils";
import { contractCall } from "@/lib/abi/rpsgame.abi";
import {
  Transaction,
  TransactionButton,
} from "@coinbase/onchainkit/transaction";

import { Check } from "lucide-react";

type Props = {
  gameData: Lobby;
};

const BattleGround = ({ gameData }: Props) => {
  const { address } = useAccount();

  const chainId = useChainId();

  const isReveal = gameData.move1 !== 0 && gameData.move2 !== 0;

  const rockMoveCall = [
    contractCall("submitMove", [BigInt(gameData.id), BigInt(1)]),
  ];
  const paperMoveCall = [
    contractCall("submitMove", [BigInt(gameData.id), BigInt(2)]),
  ];
  const scissorMoveCall = [
    contractCall("submitMove", [BigInt(gameData.id), BigInt(3)]),
  ];

  const rps_map = (num: number) => {
    switch (num) {
      case 1:
        return "rock";
      case 2:
        return "paper";
      case 3:
        return "scissors";
      default:
        return null;
    }
  };

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-center text-pretty">
          Make your move
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center gap-2">
            <CircleChoice
              label={
                address == gameData.player1
                  ? "You"
                  : formatAddress(gameData.player1)
              }
              choice={rps_map(gameData.move1)}
              isReveal={isReveal}
            />
          </div>

          <div
            className="text-sm font-medium text-muted-foreground"
            aria-hidden="true"
          >
            vs
          </div>

          <div className="flex flex-col items-center gap-2">
            <CircleChoice
              label={
                address == gameData.player2
                  ? "You"
                  : formatAddress(gameData.player2)
              }
              choice={rps_map(gameData.move2)}
              isReveal={isReveal}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex">
        <div className="grid w-full grid-cols-3 gap-3">
          <Transaction calls={rockMoveCall} chainId={chainId}>
            <Button asChild variant={"default"} size={"sm"}>
              <TransactionButton text="Rock" />
            </Button>
          </Transaction>
          <Transaction calls={paperMoveCall} chainId={chainId}>
            <Button asChild variant={"default"} size={"sm"}>
              <TransactionButton text="Paper" />
            </Button>
          </Transaction>
          <Transaction calls={scissorMoveCall} chainId={chainId}>
            <Button asChild variant={"default"} size={"sm"}>
              <TransactionButton text="Scissor" />
            </Button>
          </Transaction>
        </div>
      </CardFooter>
    </Card>
  );
};

export default BattleGround;

function CircleChoice({
  label,
  choice,
  isReveal,
}: {
  label: string;
  choice: "rock" | "paper" | "scissors" | null;
  isReveal: boolean;
}) {
  const symbol =
    choice === "rock"
      ? "R"
      : choice === "paper"
        ? "P"
        : choice === "scissors"
          ? "S"
          : "?";
  const desc =
    choice === null
      ? `${label} has not chosen yet`
      : `${label} chose ${choice}`;

  return (
    <div className="flex flex-col items-center">
      <div
        className="flex h-24 w-24 items-center justify-center rounded-full border bg-muted/30 text-2xl font-semibold"
        aria-label={desc}
      >
        {isReveal || symbol == "?" ? symbol : <Check />}
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
