interface CurrencyDisplayProps {
  amount: number
  variant?: "full" | "millions" | "thousands"
  className?: string
}

export function CurrencyDisplay({ amount, variant = "millions", className = "" }: CurrencyDisplayProps) {
  let displayValue: string

  if (variant === "millions") {
    displayValue = `₦${(amount / 1000000).toFixed(1)}M`
  } else if (variant === "thousands") {
    displayValue = `₦${(amount / 1000).toFixed(0)}K`
  } else {
    displayValue = `₦${amount.toLocaleString("en-NG")}`
  }

  return <span className={className}>{displayValue}</span>
}
