export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return

  const headers = Object.keys(data[0])

  const escapeCell = (value: unknown) => {
    if (value === null || value === undefined) return ""
    const normalized = String(value).replace(/\r?\n/g, " ")
    if (/[",]/.test(normalized)) {
      return `"${normalized.replace(/"/g, '""')}"`
    }
    return normalized
  }

  const csvContent = [
    headers.map((header) => escapeCell(header)).join(","),
    ...data.map((row) => headers.map((header) => escapeCell(row[header])).join(",")),
  ].join("\n")

  // BOM improves compatibility with Excel and spreadsheet tools.
  const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)

  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}