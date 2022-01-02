import Head from "next/head";

import Header from "components/Header";
import Footer from "components/Footer";

const Layout = ({ children, title, loading }) => {
  return (
    <div className="bg-primary min-h-screen font-space-grotesk scroll-smooth">
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </Head>
      {loading && (
        <div className="fixed min-h-full min-w-full z-10 bg-white opacity-90 flex items-center justify-center">
          <p className="text-5xl font-extrabold">Loading...</p>
        </div>
      )}
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
