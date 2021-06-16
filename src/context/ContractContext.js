import { createContext, useState, useContext } from "react";
import axios from "axios";
import Web3 from "web3";
import { CHAIN_ID, API_URL } from "../config/constants";
import { SnackbarContext } from "./SnackbarContext";

import {
  APETOKEN_ADDRESS,
  STAKINGPOOL_ADDRESS,
  API_URL_AFTER,
  API_URL_BEFORE,
} from "../config/constants";

import Apetoken from "../abis/ApeToken.json";
import Stakingpool from "../abis/StakingPoolNew.json";

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
  const [tokens, setTokens] = useState([]);
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
      setApeToken(new web3.eth.Contract(Apetoken, APETOKEN_ADDRESS));
    } catch (err) {
      console.log(err);
      setApeToken(null);
    }

    try {
      const pool = new web3.eth.Contract(Stakingpool, STAKINGPOOL_ADDRESS);
      setStakingPool(pool);
    } catch (err) {
      console.log(err);
      setStakingPool(null);
    }

    setAccount(accounts[0]);

    syncData(0, accounts[0]);
  };

  const syncData = (offset, account) => {
    const url = API_URL_BEFORE + offset + API_URL_AFTER;

    axios
      .get(url)
      .then(function (response) {
        // handle success
        let data = response.data.assets;
        let token_ids = [];
        data.forEach((value) => {
          token_ids.push(value.token_id);
        });

        axios
          .put(API_URL + "tokensFromID", {
            ids: token_ids,
            chainId: window.ethereum.chainId,
          }) //sync tokes list
          .then((response) => {
            let ids = response.data.ids;
            const forEach = (_) => {
              let addData = [];
              data.forEach((oneData) => {
                if (ids.includes(oneData["token_id"])) {
                  if (
                    oneData.hasOwnProperty("traits") &&
                    oneData["traits"].length !== 0
                  ) {
                    let traits = oneData.traits;
                    if (traits.length > 0) {
                      for (let i = 0; i < traits.length; i++) {
                        if (traits[i]["trait_type"] === "Gender") {
                          switch (traits[i].value) {
                            case "Male":
                              oneData["gender"] = 2;
                              break;
                            case "Female":
                              oneData["gender"] = 1;
                              break;
                            default:
                              oneData["gender"] = 3;
                          }
                        }
                      }
                    }
                  } else {
                    oneData["gender"] = (oneData["id"] % 3) + 1; // for RINKEBY
                  }

                  addData.push({
                    name: oneData["name"],
                    token_id: oneData["token_id"],
                    gender: oneData["gender"],
                    traits: oneData["traits"].length,
                    chainId: window.ethereum.chainId,
                  });
                }
              });

              console.log(addData);

              axios
                .post(API_URL + "createtokens", { addData, account })
                .then((data) => {});

              if (data.length === 50) {
                syncData(offset + 50, account);
              }
            };

            forEach();
          });
        // //////////////////////////////////////////////
      })
      .catch(function (error) {
        // handle error
      })
      .then(function () {
        // always executed
      });
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

  const initiateToken = (tokenId, gender, classIndex) => {
    if (stakingPool === null) {
      showMessage("Operation Failed: Initiate Token", "error");
      return;
    }

    apeToken.methods
      .isApprovedForAll(account, stakingPool._address)
      .call()
      .then((data) => {
        if (!data) {
          apeToken.methods
            .setApprovalForAll(stakingPool._address, true)
            .send({ from: account })
            .then("receipt", (receipt) => {});
        }
      });

    // initiate Max Babies if female
    if (gender === 1) {
      const maxBabies = classIndex === 3 ? 6 : classIndex === 2 ? 4 : 2;
      stakingPool.methods
        .initiateFemale([tokenId], [maxBabies])
        .send({ from: account })
        .then((data) => {})
        .catch((err) => console.log(err));
    }

    // initiate Multiplier if male
    if (gender === 2) {
      const multiplier = classIndex === 3 ? 4 : classIndex === 2 ? 3 : 2;
      stakingPool.methods
        .initiateMale([tokenId], [multiplier])
        .send({ from: account })
        .then((data) => {})
        .catch((err) => console.log(err));
    }

    if (gender === 3) {
      stakingPool.methods
        .initiateBaby([tokenId])
        .send({ from: account })
        .then((data) => {})
        .catch((err) => console.log(err));
    }
  };

  const initiateBaby = (motherId, babyId) => {
    if (stakingPool === null) {
      showMessage("Operation Failed: Initiate Token", "error");
      return;
    }

    stakingPool.methods
      .initiateBabies([motherId], [babyId])
      .send({ from: account })
      .then((data) => {})
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
    tokens,
    setTokens,
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};
