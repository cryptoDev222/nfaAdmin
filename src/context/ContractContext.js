import { createContext, useState, useContext } from "react";
import axios from "axios";
import Web3 from "web3";
import { CHAIN_ID, API_URL } from "../config/constants";
import { SnackbarContext } from "./SnackbarContext";

import { APETOKEN_ADDRESS, STAKINGPOOL_ADDRESS } from "../config/constants";

import Apetoken from "../abis/ApeToken.json";
import Stakingpool from "../abis/StakingPool.json";

export const ContractContext = createContext({
  connectWallet: () => {},
  stakingPool: {},
  apeToken: {},
  account: "",
});

export const ContractProvider = ({ children }) => {
  const { showMessage } = useContext(SnackbarContext);

  const [apeToken, setApeToken] = useState({});

  const [stakingPool, setStakingPool] = useState({});

  const [account, setAccount] = useState("");

  // contract datas
  const [stakedList, setStakedList] = useState([]);
  const [rewardsList, setRewardsList] = useState([]);
  const [stakeHistory, setStakeHistory] = useState([]);
  const [tokensForInitiate, setInitiateTokens] = useState([]);
  const [initiatedBabyCount, setInitiatedBabyCount] = useState({});
  // ///////////////

  const loadWeb3 = async () => {
    if (window.ethereum) {
      // register handlers
      window.ethereum.on("chainChanged", function (chain) {
        if (chain !== CHAIN_ID) {
          setApeToken(null);
          setStakingPool(null);

          showMessage("Please select correct network", "error");

          return false;
        }

        loadBlockchainData();
      });

      window.ethereum.on("accountsChanged", function (accounts) {
        if (accounts === undefined || accounts[0] === undefined) {
          setApeToken(null);
          setStakingPool(null);

          showMessage("Please select correct network", "error");

          return false;
        }

        if (window.ethereum.chainId !== CHAIN_ID) {
          return false;
        } else {
          loadBlockchainData();
        }
      });

      window.ethereum.on("disconnect", function () {});

      // /////////////////

      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();

      if (window.ethereum.chainId !== CHAIN_ID) {
        return false;
      }

      return true;
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      return true;
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
      return false;
    }
  };

  const loadBlockchainData = async () => {
    if (CHAIN_ID !== window.ethereum.chainId) {
      return;
    }

    const web3 = window.web3;
    // Load account
    const accounts = await web3.eth.getAccounts();

    // Load contracts
    try {
      setApeToken(new web3.eth.Contract(Apetoken.abi, APETOKEN_ADDRESS));
    } catch (err) {
      console.log(err);
      setApeToken(null);
    }

    try {
      const pool = new web3.eth.Contract(Stakingpool.abi, STAKINGPOOL_ADDRESS);
      setStakingPool(pool);
    } catch (err) {
      console.log(err);
      setStakingPool(null);
    }

    setAccount(accounts[0]);
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      if (
        window.ethereum.chainId !== CHAIN_ID &&
        window.ethereum.chainId !== null
      ) {
        showMessage("Please select correct network", "error");
      }
    }

    let res = await loadWeb3();
    if (res) await loadBlockchainData();
  };

  const initiateToken = (tokenId, gender) => {
    if (stakingPool === null) {
      showMessage("Operation Failed: Initiate Token", "error");
      return;
    }
    stakingPool.methods
      .initiate([tokenId], gender)
      .send({ from: account })
      .then((data) => {
        axios
          .put(API_URL + "/initiateToken", { tokenId, chainId: CHAIN_ID })
          .then((data) => console.log(data));
      })
      .catch((err) => console.log(err));
  };

  const initiateBaby = (motherId, babyId) => {
    if (stakingPool === null) {
      showMessage("Operation Failed: Initiate Token", "error");
      return;
    }

    stakingPool.methods
      .initiateBabies([motherId], [babyId])
      .send({ from: account })
      .then((data) => {
        axios
          .put(API_URL + "/initiateBaby", {
            motherId,
            babyId,
            chainId: CHAIN_ID,
          })
          .then((data) => console.log(data));
      })
      .catch((err) => console.log(err));
  };

  const deposit = (amount) => {
    if (stakingPool === null) {
      showMessage("Operation Failed: Initiate Token", "error");
      return;
    }

    stakingPool.methods
      .deposit()
      ?.send({ from: account, value: amount * 1000000000000000000 })
      .then((data) => console.log(data));
  };

  const activateRewards = (amount) => {
    if (stakingPool === null) {
      showMessage("Operation Failed: Initiate Token", "error");
      return;
    }

    amount = Web3.utils.toWei(amount, "ether");

    stakingPool.methods
      .notifyRewardAmount(amount)
      .send({ from: account })
      .then((data) => {
        console.log(data);
      });
  };

  const contextValue = {
    account,
    apeToken,
    stakingPool,
    connectWallet,
    initiateToken,
    deposit,
    activateRewards,
    initiateBaby,
    stakedList,
    setStakedList,
    rewardsList,
    setRewardsList,
    stakeHistory,
    setStakeHistory,
    tokensForInitiate,
    setInitiateTokens,
    initiatedBabyCount,
    setInitiatedBabyCount,
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};
