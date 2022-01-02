import "../styles/globals.css";

import { Provider, NETWORKS, CHAIN_ID_TO_NETWORK } from "@web3-ui/hooks";

function MyApp({ Component, pageProps }) {
  return (
    <Provider
      network={NETWORKS.rinkeby}
      infuraId={process.env.NEXT_PUBLIC_INFURA_ID}
    >
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
