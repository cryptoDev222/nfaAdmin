import { useEffect, useContext } from "react";
import { ContractContext } from "../context";
import axios from "axios";
import { API_URL, CHAIN_ID } from "../config/constants";

const ContractHelper = () => {
  const {
    connectWallet,
    setStakedList,
    setRewardsList,
    setStakeHistory,
    setInitiateTokens,
    setInitiatedBabyCount
  } = useContext(ContractContext);

  useEffect(() => {
    connectWallet();

    const params = { chainId: CHAIN_ID };

    axios.get(API_URL + "/stakedList", { params }).then(({ data }) => {
      setStakedList(data.result);

      let temp = {};

      data.babyCount.forEach((baby) => {
        temp[baby["mother_id"]] = baby["babyCount"];
      });

      setInitiatedBabyCount(temp);
    });

    setInterval(() => {
      axios.get(API_URL + "/stakedList", { params }).then(({ data }) => {
        setStakedList(data.result);

        let temp = {};

        data.babyCount.forEach((baby) => {
          temp[baby["mother_id"]] = baby["babyCount"];
        });

        setInitiatedBabyCount(temp);
      });
    }, 60000);

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
  }, []);

  return "";
};

export default ContractHelper;
