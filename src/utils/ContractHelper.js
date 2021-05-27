import { useEffect, useContext } from "react";
import { ContractContext } from "../context";

const ContractHelper = () => {
  const { connectWallet } = useContext(ContractContext);

  useEffect(() => {
    connectWallet()
  }, []);

  return "";
};

export default ContractHelper;
