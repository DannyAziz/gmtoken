const Footer = () => {
  return (
    <div className="h-18 w-full py-4 px-8 flex items-center justify-between bg-black fixed bottom-0 text-white">
      <p>
        Made with Curiosity by{" "}
        <a
          className="underline"
          href="https://www.twitter.com/dannyaziz97"
          target="_blank"
        >
          Danny Aziz
        </a>
      </p>
      <a className="underline">Github</a>
    </div>
  );
};

export default Footer;
