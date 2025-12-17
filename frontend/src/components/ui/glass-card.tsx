import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { forwardRef, HTMLAttributes } from "react";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "strong" | "subtle";
  hover?: boolean;
  glow?: boolean;
}

const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", hover = false, glow = false, children, ...props }, ref) => {
    const variantClasses = {
      default: "glass",
      strong: "glass-strong",
      subtle: "glass-subtle",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl p-6",
          variantClasses[variant],
          hover && "hover-lift cursor-pointer",
          glow && "shadow-glow",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

// Animated version with framer-motion
interface AnimatedGlassCardProps extends GlassCardProps {
  delay?: number;
}

const AnimatedGlassCard = forwardRef<HTMLDivElement, AnimatedGlassCardProps>(
  ({ delay = 0, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <GlassCard ref={ref} {...props} />
      </motion.div>
    );
  }
);

AnimatedGlassCard.displayName = "AnimatedGlassCard";

export { GlassCard, AnimatedGlassCard };
