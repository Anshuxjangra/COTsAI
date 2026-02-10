import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { componentName, manufacturer, specifications, criteriaMatches, performanceMetrics, componentType } =
      await request.json()

    // Create CSV content for detailed specs
    const csvContent = generateSpecsCSV({
      componentName,
      manufacturer,
      specifications,
      criteriaMatches,
      performanceMetrics,
      componentType,
    })

    // Create simple text datasheet
    const datasheetContent = generateDatasheet({
      componentName,
      manufacturer,
      specifications,
      criteriaMatches,
      performanceMetrics,
      componentType,
    })

    // Return as response with proper headers for download
    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${componentName}-specs-${Date.now()}.csv"`,
      },
    })
  } catch (error) {
    console.error("[v0] Download error:", error)
    return NextResponse.json({ error: "Failed to generate specs" }, { status: 500 })
  }
}

function generateSpecsCSV(data: any): string {
  const { componentName, manufacturer, specifications, criteriaMatches, performanceMetrics, componentType } = data

  let csv = "COMPONENT SPECIFICATION SHEET\n"
  csv += `Date Generated,${new Date().toISOString()}\n\n`

  csv += "COMPONENT INFORMATION\n"
  csv += `Component Name,${componentName}\n`
  csv += `Manufacturer,${manufacturer}\n`
  csv += `Component Type,${componentType}\n\n`

  csv += "SPECIFICATIONS\n"
  specifications.forEach((spec: string) => {
    csv += `${spec}\n`
  })
  csv += "\n"

  csv += "CRITERIA MATCHING RESULTS\n"
  csv += "Criteria Name,Status,Your Value,Requirement,Weight\n"
  criteriaMatches.forEach((criteria: any) => {
    const status = criteria.met ? "MET" : "NOT MET"
    csv += `${criteria.name},${status},${criteria.value},${criteria.requirement},${criteria.weight}\n`
  })
  csv += "\n"

  csv += "PERFORMANCE METRICS\n"
  csv += "Metric,Actual Value,Target Value,Status\n"
  performanceMetrics.forEach((metric: any) => {
    const status = metric.met ? "MET" : "CLOSE"
    csv += `${metric.label},${metric.value},${metric.target},${status}\n`
  })

  return csv
}

function generateDatasheet(data: any): string {
  const { componentName, manufacturer, specifications, criteriaMatches, performanceMetrics, componentType } = data

  let text = "═══════════════════════════════════════════════════\n"
  text += "           COMPONENT TECHNICAL DATASHEET\n"
  text += "═══════════════════════════════════════════════════\n\n"

  text += `Component:        ${componentName}\n`
  text += `Manufacturer:     ${manufacturer}\n`
  text += `Type:             ${componentType}\n`
  text += `Generated:        ${new Date().toLocaleDateString()}\n\n`

  text += "───────────────────────────────────────────────────\n"
  text += "TECHNICAL SPECIFICATIONS\n"
  text += "───────────────────────────────────────────────────\n"
  specifications.forEach((spec: string) => {
    text += `• ${spec}\n`
  })
  text += "\n"

  text += "───────────────────────────────────────────────────\n"
  text += "REQUIREMENTS COMPLIANCE\n"
  text += "───────────────────────────────────────────────────\n"
  criteriaMatches.forEach((criteria: any) => {
    const status = criteria.met ? "✓" : "✗"
    text += `${status} ${criteria.name} (${criteria.weight.toUpperCase()})\n`
    text += `    Requirement: ${criteria.requirement}\n`
    text += `    Your Input:  ${criteria.value}\n\n`
  })

  text += "───────────────────────────────────────────────────\n"
  text += "PERFORMANCE ANALYSIS\n"
  text += "───────────────────────────────────────────────────\n"
  performanceMetrics.forEach((metric: any) => {
    const status = metric.met ? "PASS" : "MARGINAL"
    text += `• ${metric.label}: ${metric.value} (Target: ${metric.target}) - ${status}\n`
  })

  text += "\n═══════════════════════════════════════════════════\n"

  return text
}
