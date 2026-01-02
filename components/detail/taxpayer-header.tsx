import type { CITTaxpayer, PITTaxpayer } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Building2, User } from "lucide-react"

interface TaxpayerHeaderProps {
  taxpayer: CITTaxpayer | PITTaxpayer
}

export function TaxpayerHeader({ taxpayer }: TaxpayerHeaderProps) {
  const isCIT = taxpayer.type === "CIT"

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
          {isCIT ? <Building2 className="w-6 h-6 text-primary" /> : <User className="w-6 h-6 text-primary" />}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {isCIT ? (taxpayer as CITTaxpayer).company_name : taxpayer.name}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-border">
              {taxpayer.type === "CIT" ? "Corporate Income Tax" : "Personal Income Tax"}
            </Badge>
            <p className="text-muted-foreground">{taxpayer.state}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
