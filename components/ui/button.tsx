import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-stone-900 text-stone-50 shadow-xs hover:bg-stone-850",
        destructive:
          "bg-red-600 text-white shadow-xs hover:bg-red-500",
        outline:
          "border border-stone-200 bg-white shadow-2xs hover:bg-stone-100 hover:text-stone-900",
        secondary:
          "bg-stone-100 text-stone-900 shadow-2xs hover:bg-stone-200",
        ghost: "hover:bg-stone-100 hover:text-stone-900",
        link: "text-stone-900 underline-offset-4 hover:underline",
        voyage:
          "bg-[#0F2027] text-[#FAF8F5] hover:bg-[#1A3644] border border-[#203A43]/50 shadow-sm",
        sand:
          "bg-[#F5EBE0] text-[#4A3B32] hover:bg-[#EBDDCF] border border-[#E3D5CA]",
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
