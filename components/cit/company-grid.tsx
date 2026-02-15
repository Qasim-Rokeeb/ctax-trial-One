import Link from "next/link"

interface CompanyGridProps {
  companies: { company_id: string; name: string; rc: string; tin: string; risk_score: number; drivers: string[] }[]
  paging: { page: number; page_size: number; total_pages: number }
}

export function CompanyGrid({ companies, paging }: CompanyGridProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        {companies.map((company) => (
          <div key={company.company_id} className="rounded-2xl border border-border/60 bg-background/70 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">{company.name}</p>
                <p className="text-xs text-muted-foreground">{company.rc}</p>
                <p className="text-xs text-muted-foreground">{company.tin}</p>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs uppercase text-primary">Risk {company.risk_score}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              {company.drivers.map((driver) => (
                <span key={driver} className="rounded-full bg-muted px-3 py-1 text-muted-foreground">
                  {driver}
                </span>
              ))}
            </div>
            <div className="mt-4 text-xs text-primary">
              <Link href={`/company/${company.company_id}`}>Open investigation</Link>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Server-side paging enabled</span>
        <span>
          Page {paging.page} of {paging.total_pages}
        </span>
      </div>
    </div>
  )
}
