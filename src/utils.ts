import VotingArtifact from "./artifacts/Voting.json";
import { Abi } from "viem";

export const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
export const contractABI = VotingArtifact.abi as Abi;
export const projectId = import.meta.env.VITE_WC_PROJECT_ID;

export function extractReason(message: string): string {
  const match = message.match(/reason:\s*(.*)/);
  return match ? match[1].trim() : message;
}
