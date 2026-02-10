import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { components, projectName } = await request.json()

    const csvContent = generateBOM(components, projectName)

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="BOM-${projectName}-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] BOM download error:", error)
    return NextResponse.json({ error: "Failed to generate BOM" }, { status: 500 })
  }
}

function generateBOM(components: any[], projectName: string): string {
  let csv = "BILL OF MATERIALS (BOM)\n"
  csv += `Project,${projectName}\n`
  csv += `Date Generated,${new Date().toISOString()}\n`
  csv += `Total Components,${components.length}\n\n`

  csv += "Item #,Component Name,Manufacturer,Part Number,Qty,Unit Price,Total Price,Availability,Lead Time,Vendor URL\n"

  components.forEach((comp, idx) => {
    csv += `${idx + 1},"${comp.name}","${comp.manufacturer}","${comp.partNumber || "N/A"}",${comp.quantity || 1},"${comp.price || "N/A"}","${
      comp.totalPrice || "N/A"
    }","${comp.availability || "Check Vendor"}","${comp.leadTime || "N/A"}","${comp.vendorUrl || "N/A"}"\n`
  })

  csv += `\n"Total Estimated Cost","","","","",${components.reduce((sum, c) => {
    const price = Number.parseFloat((c.price || "0").replace(/[^0-9.-]+/g, ""))
    return sum + (isNaN(price) ? 0 : price)
  }, 0)}"\n`

  return csv
}
