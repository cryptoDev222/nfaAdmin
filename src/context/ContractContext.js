import { createContext, useState, useContext } from "react";
import axios from "axios";
import Web3 from "web3";
import { CHAIN_ID, API_URL } from "../config/constants";
import { SnackbarContext } from "./SnackbarContext";

import {
  APETOKEN_ADDRESS,
  STAKINGPOOLV2_ADDRESS as STAKINGPOOL_ADDRESS,
  STAKINGPOOLV1_ADDRESS,
  API_URL_AFTER,
  API_URL_BEFORE,
} from "../config/constants";

import Apetoken from "../abis/ApeToken.json";
import Stakingpool from "../abis/StakingPoolV2.json";
import StakingpoolV1 from "../abis/StakingPoolNew.json";

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

      let apes = stakedList;
      apes = apes.map((ape) => {
        if (ape.gender === 1) {
          pool.methods
            .breedingEnd(ape.token_id)
            .call()
            .then((data) => {
              ape["breedingEnd"] = data * 1000;
              return ape;
            });
        }
        return ape;
      });

      setStakedList(apes);

      const params = { chainId: CHAIN_ID };
      setInterval(async () => {
        axios.get(API_URL + "/stakedList", { params }).then(({ data }) => {
          apes = data.result;

          let results = [];

          const forLoop = async (_) => {
            for (let i = 0; i < apes.length; i++) {
              let ape = apes[i];
              if (ape.gender === 1) {
                ape["breedingEnd"] =
                  (await pool.methods.breedingEnd(ape.token_id).call()) * 1000;
              }
              results.push(ape);
            }

            setStakedList(apes);
          };

          forLoop();

          let temp = {};

          data.babyCount.forEach((baby) => {
            temp[baby["mother_id"]] = baby["babyCount"];
          });

          setInitiatedBabyCount(temp);
        });
      }, 6000);
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
        let img_urls = [];
        data.forEach((value) => {
          token_ids.push(value.token_id);
          img_urls.push(value.image_url);
        });

        axios
          .put(API_URL + "tokensFromID", {
            ids: token_ids,
            images: img_urls,
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

                  if (
                    oneData.hasOwnProperty("gender") &&
                    oneData["gender"] != null
                  ) {
                    addData.push({
                      name: oneData["name"],
                      token_id: oneData["token_id"],
                      gender: oneData["gender"],
                      traits: oneData["traits"].length,
                      img_url: oneData["image_url"],
                      chainId: window.ethereum.chainId,
                    });
                  }
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

    apeToken.methods
      .isApprovedForAll(account, apeToken._address)
      .call()
      .then((data) => {
        if (!data) {
          apeToken.methods
            .setApprovalForAll(apeToken._address, true)
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

  const stakedListClaimTime = (apes) => {
    setStakedList(apes);
  };

  const migrateV1 = () => {
    apeToken.methods
      .isApprovedForAll(account, stakingPool._address)
      .call()
      .then((data) => {
        if (!data) {
          apeToken.methods
            .setApprovalForAll(stakingPool._address, true)
            .send({ from: account })
            .then((data) => {
              migrate();
            });
        } else {
          migrate();
        }
      });
  };

  const migrate = () => {
    console.log("tokens", tokens);
    let initiatedTokens = tokens.filter((token) => token.initiate_flag === 1);
    console.log("initiatedTokens", initiatedTokens);
    let f1 = initiatedTokens.filter(
      (token) => token.gender === 1 && token.class === 1
    );
    let f2 = initiatedTokens.filter(
      (token) => token.gender === 1 && token.class === 2
    );
    let f3 = initiatedTokens.filter(
      (token) => token.gender === 1 && token.class === 3
    );
    let m1 = initiatedTokens.filter(
      (token) => token.gender === 2 && token.class === 1
    );
    let m2 = initiatedTokens.filter(
      (token) => token.gender === 2 && token.class === 2
    );
    let m3 = initiatedTokens.filter(
      (token) => token.gender === 2 && token.class === 3
    );
    let b = initiatedTokens.filter((token) => token.gender === 3);
    let fids = [];
    let b_counts = [];
    let mids = [];
    let multis = [];
    if (f1.length) {
      for (let i = 0; i < f1.length; i++) {
        fids.push(f1[i].token_id);
        b_counts.push(2);
      }
    }
    if (f2.length) {
      for (let i = 0; i < f2.length; i++) {
        fids.push(f2[i].token_id);
        b_counts.push(4);
      }
    }
    if (f3.length) {
      for (let i = 0; i < f3.length; i++) {
        fids.push(f3[i].token_id);
        b_counts.push(6);
      }
    }
    if (m1.length) {
      for (let i = 0; i < m1.length; i++) {
        mids.push(m1[i].token_id);
        multis.push(2);
      }
    }
    if (m2.length) {
      for (let i = 0; i < m2.length; i++) {
        mids.push(m2[i].token_id);
        multis.push(3);
      }
    }
    if (m3.length) {
      for (let i = 0; i < m3.length; i++) {
        mids.push(m3[i].token_id + "");
        multis.push(4 + "");
      }
    }
    if (fids.length !== 0) {
      stakingPool.methods
        .initiateFemale(fids, b_counts)
        .send({ from: account })
        .then(console.log)
        .catch(console.log);
    }
    if (mids.length !== 0) {
      console.log(mids.length);
      stakingPool.methods
        .initiateMale(mids, multis)
        .send({ from: account })
        .then(console.log)
        .catch(console.log);
    }
    if (b.length !== 0) {
      let bids = b.map((baby) => baby.token_id);
      // stakingPool.methods
      //   .initiateBaby(bids)
      //   .send({ from: account })
      //   .then(console.log)
      //   .catch(console.log);

      // let mappedBaby = b.filter((baby) => baby.mother_id);
      // let mother_ids = mappedBaby.map((baby) => baby.mother_id);
      // let token_ids = mappedBaby.map((baby) => baby.token_id);
      // if (mother_ids.length) {
      //   stakingPool.methods
      //     .initiateBabies(mother_ids, token_ids)
      //     .send({ from: account })
      //     .then(console.log)
      //     .catch(console.log);
      }

      const poolV1 = new window.web3.eth.Contract(
        StakingpoolV1,
        STAKINGPOOLV1_ADDRESS
      );

      console.log(poolV1);

      let apes = stakedList;
      apes = apes.filter((ape) => ape.gender === 1);
      // eslint-disable-next-line array-callback-return
      // const loop = (i)=> {
      //   if(i === apes.length) {
      //     let femaleIds = apes.map((ape) => ape.token_id);
      //     let breedingTimes = apes.map((ape) => ape.breedingEnd);
      //     console.log("breedingEnd", breedingTimes);
      //     stakingPool.methods
      //       .setV1Data(femaleIds, breedingTimes)
      //       .send({ from: account })
      //       .then(console.log)
      //       .catch(console.log);
      //   } else {
      //     const ape = apes[i];
      //     poolV1.methods
      //       .breedingEnd(ape.token_id)
      //       .call()
      //       .then((data) => {
      //         apes[i]["breedingEnd"] = data;
      //         loop(i+1);
      //       });
      //   }
      // }

      // loop(0);
    }

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
    stakedListClaimTime,
    migrateV1,
  };

  return (
    <ContractContext.Provider value={contextValue}>
      {children}
    </ContractContext.Provider>
  );
};
