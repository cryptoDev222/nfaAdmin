import { useContext } from "react";
import { Box, Hidden, Toolbar, Button } from "@material-ui/core";

import Avatar from "./Avatar";
import Logo from "./Logo";
import { ContractContext } from "../../../../context/ContractContext";

const HeaderContent = (props) => {
  const { connectWallet, account } = useContext(ContractContext);

  return (
    <Toolbar>
      <Logo />

      <Box flexGrow={1} />

      <Button
        variant="contained"
        disabled={account}
        color="primary"
        onClick={connectWallet}
      >
        <p style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{account === "" ? "Connect" : account}</p>
      </Button>

      <Avatar />

      <Hidden lgUp>{props.sidebarTrigger}</Hidden>
    </Toolbar>
  );
};

export default HeaderContent;
