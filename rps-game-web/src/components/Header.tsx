import { Link } from '@tanstack/react-router'
import { Wallet } from '@coinbase/onchainkit/wallet';

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row justify-between w-full items-center">
        <div className="px-2 font-bold">
          <Link to="/">RPS Game</Link>
        </div>
        <Wallet/>
      </nav>
    </header>
  )
}


