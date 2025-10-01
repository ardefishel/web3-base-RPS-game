import InGame from "@/components/InGame";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { createFileRoute } from "@tanstack/react-router";
import { useAccount } from "wagmi";


export const Route = createFileRoute("/")({
  component: App,
});

const styleConst = {
  headerHeight: '64px'
}

function App() {
  const {isConnected} = useAccount()
  return (
    <>
    {!isConnected ? <WelcomePage/> : (
      <div className="p-4">
        <InGame/>
      </div>
    ) }
    </>
  );
}

function WelcomePage() {

  return <main className={`w-full max-w-screen-lg pb-8 h-[calc(100vh-${styleConst.headerHeight})] flex flex-col justify-center items-center mx-auto space-y-8 `}>
  <div className="text-center space-y-2">
    <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-100">Welcome to RPS Game</h1>
    <h2 className="text-xl text-gray-600 dark:text-gray-300">Rock. Paper. Scissor. But Web3.</h2>
  </div>
  <div className="text-center space-y-4">
    <p className="text-lg text-gray-700 dark:text-gray-200">Connect your wallet to start the game:</p>
    <Wallet className="mx-auto"/>
  </div>
</main>
}