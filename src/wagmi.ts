import { http, createConfig } from "wagmi";
import { bscTestnet, mainnet, sepolia } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { projectId } from "./utils";

export const config = createConfig({
  chains: [mainnet, sepolia, bscTestnet],
  connectors: [
    injected(),
    coinbaseWallet({ appName: "Create Wagmi" }),
    walletConnect({ projectId: projectId }),
  ],
  transports: {
    [bscTestnet.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
