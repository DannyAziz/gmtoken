import Button from "components/Button";

import { useWallet } from "@web3-ui/hooks";

const Header = () => {
  const { connectWallet, disconnectWallet, connection, connected } =
    useWallet();

  const onClick = () => {
    if (connected) {
      alert("Do something");
    } else {
      disconnectWallet();
      connectWallet();
    }
  };

  return (
    <div className="h-18 w-full py-4 px-8 flex items-center justify-between">
      <span className="text-4xl">👋</span>
      <Button
        type="primary"
        onClick={onClick}
        text={
          connected
            ? `0x..${connection.userAddress.substring(
                connection.userAddress.length - 4,
                connection.userAddress.length
              )}`
            : "Connect Wallet"
        }
      />
    </div>
  );
};

export default Header;
