import { Link, type LinkProps } from 'react-router-dom';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

const baseClassName =
  'inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5';

const variants = {
  primary: 'border-white bg-white text-black hover:bg-neutral-100',
  secondary: 'border-white/20 bg-transparent text-white hover:border-white/50',
  dark: 'border-neutral-900 bg-neutral-900 text-white hover:bg-black',
  light: 'border-neutral-300 bg-white text-neutral-900 hover:border-neutral-400',
};

interface SharedProps {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}

export function ButtonLink({ children, variant = 'primary', className = '', ...props }: LinkProps & SharedProps) {
  return (
    <Link className={`${baseClassName} ${variants[variant]} ${className}`} {...props}>
      {children}
    </Link>
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & SharedProps
>(function Button({ children, variant = 'primary', className = '', ...props }, ref) {
  return (
    <button ref={ref} className={`${baseClassName} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
});
