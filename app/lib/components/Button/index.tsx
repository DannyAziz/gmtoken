const Button = ({
  type = "primary",
  text,
  onClick = () => {},
  disabled = false,
}: {
  type: "green" | "primary";
  text: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  let bgColorClass = "";
  if (type === "green") {
    bgColorClass = "bg-[#03C38B]";
  } else {
    bgColorClass = "bg-gradient-to-r from-[#3F5EFB] to-[#FC466B]";
  }
  return (
    <button
      className={`px-12 py-4 text-xl font-bold ${bgColorClass} rounded-sm shadow-lg ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="text-white">{text}</span>
    </button>
  );
};

export default Button;
