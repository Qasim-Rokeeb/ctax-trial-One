"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface AssignCaseModalProps {
  case_id: string
  auditors: { id: string; name: string }[]
}

export function AssignCaseModal({ case_id, auditors }: AssignCaseModalProps) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(auditors[0]?.id ?? "")

  return (
    <div>
      <Button className="bg-primary text-primary-foreground" onClick={() => setOpen(true)}>
        Assign case
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border/60 bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Assign case</h3>
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Case ID: {case_id}</p>
            <div className="mt-4 space-y-2">
              {auditors.map((auditor) => (
                <label key={auditor.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/70 px-4 py-2 text-sm">
                  <span>{auditor.name}</span>
                  <input
                    type="radio"
                    name="auditor"
                    value={auditor.id}
                    checked={selected === auditor.id}
                    onChange={() => setSelected(auditor.id)}
                  />
                </label>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Assignment requires approval log.</p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-primary text-primary-foreground">Submit for approval</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
