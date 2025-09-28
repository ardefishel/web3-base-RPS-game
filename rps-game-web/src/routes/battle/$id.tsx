import BattleGround from "@/components/BattleGround";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/battle/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="mx-auto w-full max-w-screen-sm p-4 space-y-4">
      <header className="space-y-1 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-balance">Lobby #21321</h1>
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
