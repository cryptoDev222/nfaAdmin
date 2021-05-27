import { createContext, useState } from "react";
import { CHAIN_ID } from "../config/constants";
import { SnackbarContext } from "./SnackbarContext";

const { showMessage } = SnackbarContext;

export const ContractContext = createContext({
  connectWallet: () => {},
  stakingPool: {},
  apeToken: {},
});

export const ContractProvider = ({ children }) => {
  const [apeToken, setApeToken] = useState({});

  const [stakingPool, setStakingPool] = useState({});

  const connectWallet = () => {
    if (window.ethereum) {
      if (
        window.ethereum.chainId !== CHAIN_ID &&
        window.ethereum.chainId !== null
      ) {
        showMessage("Please select correct network", { type: "error" });
      }
    }

    // let res = await this.loadWeb3();
    // if (res) await this.loadBlockchainData();
  };

  const contextValue = {
    apeToken,
    stakingPool,
    connectWallet,
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};
