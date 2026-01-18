import { cn } from "@/lib/utils"

interface DividerProps {
  className?: string
  text?: string
}

export function Divider({ className, text }: DividerProps) {
  if (text) {
    return (
      <div className={cn("relative flex items-center py-5", className)}>
        <div className="flex-grow border-t border-border"></div>
        <span className="flex-shrink mx-4 text-gray-400 text-sm">{text}</span>
        <div className="flex-grow border-t border-border"></div>
      </div>
    )
  }
  return <hr className={cn("my-4 border-border", className)} />
}
