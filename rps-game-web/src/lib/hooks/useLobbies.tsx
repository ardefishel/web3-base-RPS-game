import { useMemo } from "react"
import { useReadContract, useReadContracts } from "wagmi"
import { contractCall } from "../abi/rpsgame.abi"
import { ContractFunctionParameters } from "viem"
import type { Lobby } from "@/components/LobbyCard"

type GameResult = {
    player1: `0x${string}`
    player2: `0x${string}`
    move1: number | bigint
    move2: number | bigint
    status: number // 0 Waiting, 1 Ongoing, 2 Finished
    winner: `0x${string}`
}

const toLobbyStatus = (s: number): Lobby["status"] => {
    if (s === 0) return "awaiting_player"
    if (s === 1) return "in_progress"
    return "win"
}

export function useLobbies() {
    const { data: gameCounterRaw, refetch: refetchCounter, isLoading: isCounterLoading, isError: isCounterError, error: counterError } =
        useReadContract(contractCall("gameCounter"))

    const gameCounter = Number(gameCounterRaw ?? 0)

    const contractCalls: ContractFunctionParameters[] = useMemo(() => {
        if (!Number.isFinite(gameCounter) || gameCounter <= 0) return []
        return Array.from({ length: gameCounter }, (_, i) => contractCall("getGame", [BigInt(i + 1)]))
    }, [gameCounter])

    const { data: allGame, isLoading: isGamesLoading, isError: isGamesError, error: gamesError, refetch: refetchGames } = useReadContracts({
        contracts: contractCalls,
    })

    const lobbies: Lobby[] = useMemo(() => {
        if (!allGame) return []
        return allGame
            .map((item, index) => {
                if (item.status !== "success" || !item.result) return null
                const result = item.result as GameResult
                const lobby: Lobby = {
                    id: String(index + 1),
                    status: toLobbyStatus(Number(result.status)),
                    player1: result.player1,
                    player2: result.player2,
                    move1: Number(result.move1 ?? 0),
                    move2: Number(result.move2 ?? 0),
                    winner: result.winner,
                }
                return lobby
            })
            .filter((x): x is Lobby => x !== null)
            .sort((a, b) => Number(b.id) - Number(a.id))
    }, [allGame])

    return {
        lobbies,
        loading: isCounterLoading || isGamesLoading,
        error: (isCounterError && counterError) || (isGamesError && gamesError) || null,
        refetchLobbies: async () => {
            await refetchCounter()
            await refetchGames()
        },
    }
}