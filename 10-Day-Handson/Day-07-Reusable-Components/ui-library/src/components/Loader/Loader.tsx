import "./Loader.css";

type LoaderProps = {
  size?: "small" | "large";
};

function Loader({ size = "small" }: LoaderProps) {
  return <div className={`loader loader-${size}`} />;
}

export default Loader;
