import BattleGround from "@/components/BattleGround";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/battle/$id")({
  component: RouteComponent,
  loader: ({params}) => {
    return {
      lobbyId: params.id
    }
  }
});

function RouteComponent() {

  const loader = Route.useLoaderData()

  return (
    <main className="mx-auto w-full max-w-screen-sm p-4 space-y-4">
      <header className="space-y-1 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-balance">Lobby #{loader.lobbyId}</h1>
        <div>
            <Button>
                Join
            </Button>
        </div>
      </header>
      <BattleGround />
    </main>
  );
}
