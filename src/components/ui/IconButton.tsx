import { type LucideIcon } from "lucide-react";

type IconButtonProps = {
  icon: LucideIcon;
  label?: string;
  disabled?: boolean;
  size?: number;
  strokeWidth?: number;
  onClick?: () => void;
};

export default function IconButton({
  icon: Icon,
  label,
  disabled = false,
  size = 24,
  strokeWidth = 2,
  onClick,
}: Readonly<IconButtonProps>) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="inline-flex items-center gap-2 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Icon size={size} strokeWidth={strokeWidth} />
      <span>{label}</span>
    </button>
  );
}
