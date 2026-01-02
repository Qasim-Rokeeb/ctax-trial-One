import type { CITTaxpayer, PITTaxpayer } from "@/lib/mock-data"
import { Card } from "@/components/ui/card"
import { Mail, Phone, MapPin, Briefcase, Users } from "lucide-react"

interface TaxpayerInfoProps {
  taxpayer: CITTaxpayer | PITTaxpayer
}

export function TaxpayerInfo({ taxpayer }: TaxpayerInfoProps) {
  const isCIT = taxpayer.type === "CIT"
  const citTaxpayer = taxpayer as CITTaxpayer
  const pitTaxpayer = taxpayer as PITTaxpayer

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Contact Information */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Email</p>
              <p className="text-foreground">{taxpayer.email}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Phone</p>
              <p className="text-foreground">{taxpayer.phone}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground mb-1">Address</p>
              <p className="text-foreground">
                {taxpayer.address}
                <br />
                {taxpayer.state}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Business/Income Information */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          {isCIT ? "Business Information" : "Income Information"}
        </h3>
        <div className="space-y-4">
          {isCIT ? (
            <>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Business Type</p>
                  <p className="text-foreground">{citTaxpayer.business_type}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Employees</p>
                  <p className="text-foreground">{citTaxpayer.employees_count}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Registration Number</p>
                <p className="text-foreground font-mono text-sm">{citTaxpayer.registration_number}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Annual Turnover</p>
                <p className="text-foreground">₦{(citTaxpayer.annual_turnover / 1000000).toFixed(1)}M</p>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-start gap-3">
                <Briefcase className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Occupation</p>
                  <p className="text-foreground">{pitTaxpayer.occupation}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Income Sources</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {pitTaxpayer.income_sources.map((source) => (
                    <span key={source} className="px-2 py-1 bg-secondary text-foreground text-xs rounded">
                      {source}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Annual Income</p>
                <p className="text-foreground">₦{(pitTaxpayer.annual_income / 1000000).toFixed(1)}M</p>
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  )
}
