import "../styles/globals.css";

import { Provider, NETWORKS } from "@web3-ui/hooks";

function MyApp({ Component, pageProps }) {
  return (
    <Provider
      network={
        process.env.NODE_ENV === "production"
          ? NETWORKS.mainnet
          : NETWORKS.rinkeby
      }
      infuraId={process.env.NEXT_PUBLIC_INFURA_ID}
    >
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
