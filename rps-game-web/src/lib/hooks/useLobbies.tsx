import { useEffect, useMemo, useState } from "react"
import { useReadContract, useReadContracts } from "wagmi"
import { contractCall } from "../abi/rpsgame.abi"
import { ContractFunctionParameters } from "viem"
import type { Lobby } from "@/components/LobbyCard"

export function useLobbies() {
    const [lobbies, setLobbies] = useState<Lobby[]>([])
    const [contractCalls, setContractCalls] = useState<ContractFunctionParameters[]>([])
    const {data: gameCounter, refetch: refetchCounter } = useReadContract(contractCall("gameCounter"))
    const { data: allGame, refetch: refetchAllContract } = useReadContracts({
        contracts: contractCalls
    })
    useEffect(() => {
        const gameCounterNumber = Number(gameCounter ?? 0)
        if (gameCounterNumber <= 0) return
        setContractCalls(
            Array.from({length: gameCounterNumber}, (_,i) => contractCall('getGame', [BigInt(i+1)]))
        )
        refetchAllContract()
    }, [gameCounter])

    useEffect(() => {
      if(!allGame) return
      setLobbies(
        allGame.map((item, index) => {
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
            .filter((x): x is Lobby => x !== null)
      )

    }, [allGame])
    
    
    return {
        lobbies,
        refetchLobbies: refetchCounter
    }
}