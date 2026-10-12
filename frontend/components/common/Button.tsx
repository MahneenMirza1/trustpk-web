import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
} from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "white";

export type ButtonSize = "sm" | "md" | "lg";

type CommonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  loading?: boolean;
  showArrow?: boolean;
  children: ReactNode;
  className?: string;
};

export type ButtonProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps>;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 focus-visible:ring-brand-500 shadow-soft",
  secondary:
    "bg-navy text-white hover:bg-navy-800 focus-visible:ring-navy shadow-soft",
  outline:
    "border border-brand-200 bg-white text-brand-700 hover:border-brand-400 hover:bg-brand-50 focus-visible:ring-brand-400",
  ghost:
    "bg-transparent text-ink hover:bg-brand-50 focus-visible:ring-brand-400",
  danger:
    "bg-danger text-white hover:bg-red-700 focus-visible:ring-danger shadow-soft",
  white:
    "bg-white text-navy hover:bg-brand-50 focus-visible:ring-white shadow-soft",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 rounded-[10px] px-3.5 text-sm",
  md: "h-11 rounded-[12px] px-5 text-sm",
  lg: "h-12 rounded-[12px] px-6 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  loading = false,
  showArrow = false,
  disabled = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 whitespace-nowrap",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 select-none",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {loading ? (
        <Loader2
          className="h-4 w-4 shrink-0 animate-spin"
          aria-hidden
        />
      ) : null}

      {children}

      {showArrow && !loading ? (
        <ArrowRight
          className="h-4 w-4 shrink-0"
          aria-hidden
        />
      ) : null}
    </>
  );

  if (href) {
    const linkProps = props as AnchorHTMLAttributes<HTMLAnchorElement>;

    return (
      <Link
        href={href}
        className={classes}
        aria-disabled={disabled || loading}
        tabIndex={disabled || loading ? -1 : undefined}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const buttonProps =
    props as ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
