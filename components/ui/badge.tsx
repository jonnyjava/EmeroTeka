import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[#2A3E92] text-white shadow-xs hover:bg-[#1E2D69]",
        secondary:
          "border-[#CCD5EE] bg-[#EEF2FF] text-[#2A3E92] hover:bg-[#E0E7FF]",
        destructive:
          "border-transparent bg-red-600 text-white shadow-xs hover:bg-red-500",
        outline: "border-[#CCD5EE] text-[#1B275E]",
        stTropaz: "border-[#1B275E] bg-[#2A3E92] text-white font-mono shadow-2xs",
        stTropazLight: "border-[#CCD5EE] bg-[#EEF2FF] text-[#2A3E92] font-mono",
        lpGold: "border-[#D9A321] bg-[#FFC72C] text-[#1B275E] font-mono font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
