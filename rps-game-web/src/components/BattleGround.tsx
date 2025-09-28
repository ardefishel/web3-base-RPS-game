
import { Button } from './ui/button'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card'

type Choice = "rock" | "paper" | "scissors"

type Props = {}

const BattleGround = (props: Props) => {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle className="text-center text-pretty">Make your move</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <div className="flex flex-col items-center gap-2">
            <CircleChoice label="You" choice={"rock"} />
          </div>

          <div className="text-sm font-medium text-muted-foreground" aria-hidden="true">
            vs
          </div>

          <div className="flex flex-col items-center gap-2">
            <CircleChoice label="Computer" choice={"rock"} />
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex">
        <div className="grid w-full grid-cols-3 gap-3">
          <MoveButton label="Rock" value="rock" onPick={() => {}} />
          <MoveButton label="Paper" value="paper" onPick={() => {}} />
          <MoveButton label="Scissors" value="scissors" onPick={() => {}} />
        </div>
      </CardFooter>
    </Card>
  )
}

export default BattleGround

function MoveButton({
    label,
    value,
    onPick,
  }: {
    label: string
    value: Choice
    onPick: (c: Choice) => void
  }) {
    return (
      <Button className="w-full" onClick={() => onPick(value)} aria-label={`Choose ${label}`}>
        {label}
      </Button>
    )
  }
  
  function CircleChoice({
    label,
    choice,
  }: {
    label: string
    choice: "rock" | "paper" | "scissors" | null
  }) {
    const symbol = choice === "rock" ? "R" : choice === "paper" ? "P" : choice === "scissors" ? "S" : "?"
    const desc = choice === null ? `${label} has not chosen yet` : `${label} chose ${choice}`
  
    return (
      <div className="flex flex-col items-center">
        <div
          className="flex h-24 w-24 items-center justify-center rounded-full border bg-muted/30 text-2xl font-semibold"
          aria-label={desc}
        >
          {symbol}
        </div>
        <div className="mt-2 text-sm text-muted-foreground">{label}</div>
      </div>
    )
  }
  