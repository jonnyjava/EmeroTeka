import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-[#2A3E92] text-white shadow-xs hover:bg-[#1E2D69]",
        destructive:
          "bg-red-600 text-white shadow-xs hover:bg-red-500",
        outline:
          "border-2 border-[#DCE2EE] bg-white text-[#1B275E] shadow-2xs hover:bg-[#EEF2FF] hover:border-[#2A3E92] hover:text-[#2A3E92]",
        secondary:
          "bg-[#EEF2FF] text-[#2A3E92] border border-[#CCD5EE] shadow-2xs hover:bg-[#E0E7FF]",
        ghost: "hover:bg-[#EEF2FF] hover:text-[#2A3E92]",
        link: "text-[#2A3E92] underline-offset-4 hover:underline",
        voyage:
          "bg-[#2A3E92] text-white hover:bg-[#1E2D69] border border-[#1B275E]/80 shadow-sm",
        stTropaz:
          "bg-[#2A3E92] text-white hover:bg-[#1E2D69] active:bg-[#141E46] shadow-sm",
        lpGold:
          "bg-[#FFC72C] text-[#1B275E] hover:bg-[#E5B327] font-bold shadow-xs",
        sand:
          "bg-[#F8F9FC] text-[#1B275E] hover:bg-[#EEF2FF] border border-[#CCD5EE]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
