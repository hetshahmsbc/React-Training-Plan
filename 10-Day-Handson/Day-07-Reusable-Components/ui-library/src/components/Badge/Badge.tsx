import "./Badge.css";

type BadgeProps = {
  text: string;
  color?: "blue" | "green" | "orange" | "purple" | "gray";
};

function Badge({ text, color = "gray" }: BadgeProps) {
  return <span className={`badge badge-${color}`}>{text}</span>;
}

export default Badge;
