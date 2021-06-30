import { useEffect, useContext } from "react";
import { ContractContext } from "../context";
import axios from "axios";
import { API_URL, CHAIN_ID } from "../config/constants";
import Web3 from "web3";

const ContractHelper = () => {
  const {
    setRewardsList,
    setStakeHistory,
    setInitiateTokens,
    setInitiatedBabyCount,
    setTokens,
    stakedListClaimTime
  } = useContext(ContractContext);

  useEffect(() => {
    const params = { chainId: CHAIN_ID };

    axios.get(API_URL + "/stakedList", { params }).then(({ data }) => {
      stakedListClaimTime(data.result);

      let temp = {};

      data.babyCount.forEach((baby) => {
        temp[baby["mother_id"]] = baby["babyCount"];
      });

      setInitiatedBabyCount(temp);
    });

    axios.get(API_URL + "/rewardsList", { params }).then(({ data }) => {
      setRewardsList(data);
    });

    setInterval(() => {
      axios.get(API_URL + "/rewardsList", { params }).then(({ data }) => {
        setRewardsList(data);
      });
    }, 60000);

    axios.get(API_URL + "/stakeHistory", { params }).then(({ data }) => {
      setStakeHistory(data);
    });

    setInterval(() => {
      axios.get(API_URL + "/stakeHistory", { params }).then(({ data }) => {
        setStakeHistory(data);
      });
    }, 60000);

    axios.get(API_URL + "/tokensForInitiate", { params }).then(({ data }) => {
      setInitiateTokens(data);
    });

    setInterval(() => {
      axios.get(API_URL + "/tokensForInitiate", { params }).then(({ data }) => {
        setInitiateTokens(data);
      });
    }, 60000);

    axios.get(API_URL + "/allTokens", { params }).then(({ data }) => {
      setTokens(data);
    });

    setInterval(() => {
      axios.get(API_URL + "/allTokens", { params }).then(({ data }) => {
        setTokens(data);
      });
    }, 60000);
  }, []);

  return "";
};

export default ContractHelper;
