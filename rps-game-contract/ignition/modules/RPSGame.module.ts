import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("RPSModule", (m) => {
  // Deploy the RockPaperScissors contract
  const rps = m.contract("RPSGame");

  return { rps };
});