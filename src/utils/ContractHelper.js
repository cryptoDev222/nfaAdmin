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
    stakedListClaimTime,
  } = useContext(ContractContext);

  useEffect(() => {
    axios
      .get(
        "https://api.opensea.io/api/v1/assets?owner=0x86372222D57Bcb24305E7bc03B912730DB1A6fea&order_direction=desc&offset=0&limit=50&collection=nonfungibleapes"
      )
      .then(({ data }) => {
        // handle success
        data = data.assets;
        let token_ids = [];
        let images = [];
        data.forEach((value) => {
          token_ids.push(value.token_id);
          images.push(value.image_url);
        });

        const account = "0x86372222D57Bcb24305E7bc03B912730DB1A6fea";

        axios
          .put(API_URL + "tokens", {
            ids: token_ids,
            images: images,
            account,
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
                    img_url: oneData["image_url"],
                    traits: oneData["traits"].length,
                    chainId: window.ethereum.chainId,
                  });

                  console.log(oneData);
                }
              });

              axios
                .post(API_URL + "createtokens", { addData, account })
                .then((status) => {});
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

    const params = { chainId: CHAIN_ID };

    axios.get(API_URL + "/stakedList", { params }).then(({ data }) => {
      data.result = data.result.filter(oneData => oneData['account_id'] !== "0x81d03bF5e59F42B6088bDeAbEF82096578168fbd")
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
