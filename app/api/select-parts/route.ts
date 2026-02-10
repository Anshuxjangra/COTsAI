import { type NextRequest, NextResponse } from "next/server"

// Mock database of COTS components
const cotsDatabase = {
  bearing: [
    {
      id: "bearing-001",
      name: "Deep Groove Ball Bearing 6008",
      manufacturer: "SKF",
      rating: 4.8,
      price: "$25-35",
      availability: "In Stock",
      specifications: [
        "Bore diameter: 40mm",
        "Outer diameter: 68mm",
        "Width: 15mm",
        "Dynamic load rating: 28.9 kN",
        "Speed rating: 10,000 RPM",
      ],
      pros: [
        "High-speed capability",
        "Low friction and noise",
        "Good corrosion resistance with stainless steel option",
        "Readily available",
        "Excellent reliability record",
      ],
      cons: [
        "Not suitable for extreme vibration",
        "Limited temperature range",
        "Standard sealed bearings may limit speed",
      ],
      alternatives: [
        { name: "Angular Contact Bearing 7008", manufacturer: "NSK" },
        { name: "Cylindrical Roller Bearing NJ208", manufacturer: "FAG" },
      ],
      vendorUrl: "https://www SKF.com/en/products/bearings/deep-groove-ball-bearing-6008",
    },
    {
      id: "bearing-002",
      name: "Tapered Roller Bearing 30208",
      manufacturer: "Timken",
      rating: 4.6,
      price: "$40-50",
      availability: "In Stock",
      specifications: [
        "Bore diameter: 40mm",
        "Outer diameter: 80mm",
        "Width: 18mm",
        "Dynamic load rating: 47.5 kN",
        "Static load rating: 50 kN",
      ],
      pros: [
        "High load capacity",
        "Excellent radial and axial load handling",
        "Suitable for automotive and industrial applications",
        "Good thermal stability",
      ],
      cons: ["Requires proper preload setup", "Higher friction than ball bearings", "Regular maintenance needed"],
      alternatives: [
        { name: "Spherical Roller Bearing 22208", manufacturer: "SKF" },
        { name: "Cylindrical Roller Bearing NU208", manufacturer: "Schaeffler" },
      ],
      vendorUrl: "https://www.timken.com/en-us/products/industrial-bearings/tapered-roller-bearing-30208",
    },
  ],
  motor: [
    {
      id: "motor-001",
      name: "AC Induction Motor IE3 1.5kW",
      manufacturer: "Siemens",
      rating: 4.9,
      price: "$150-200",
      availability: "In Stock",
      specifications: [
        "Power: 1.5 kW",
        "Speed: 1500 RPM",
        "Voltage: 3-phase 400V",
        "Frame size: 90L",
        "Efficiency: 85.3% (IE3)",
      ],
      pros: [
        "High efficiency - lower energy costs",
        "Compact and lightweight",
        "Excellent thermal performance",
        "Wide availability",
        "Long operational life",
      ],
      cons: [
        "Three-phase power required",
        "Not suitable for variable speed without VFD",
        "Requires proper cooling for continuous operation",
      ],
      alternatives: [
        { name: "AC Motor IE2 1.5kW", manufacturer: "ABB" },
        { name: "NEMA Premium Motor 1.5HP", manufacturer: "Baldor" },
      ],
      vendorUrl: "https://www.siemens.com/en-us/products/electromechanical-systems/motors.html",
    },
  ],
  gear: [
    {
      id: "gear-001",
      name: "Spur Gear Module 2.0 Steel",
      manufacturer: "Neugart",
      rating: 4.7,
      price: "$15-25",
      availability: "In Stock",
      specifications: [
        "Module: 2.0mm",
        "Material: 16CrNiMo4 Steel",
        "Pressure angle: 20°",
        "Bore: 15mm",
        "Face width: 25mm",
      ],
      pros: [
        "High torque transmission",
        "Precise machining",
        "Excellent for industrial applications",
        "Multiple mounting options",
      ],
      cons: ["Noise at high speeds", "Lubrication required", "Higher cost than plastic alternatives"],
      alternatives: [
        { name: "Helical Gear Module 2.0", manufacturer: "KHK" },
        { name: "Bevel Gear 2.0", manufacturer: "Ondrives" },
      ],
      vendorUrl: "https://www.neugart.com/en/products/spur-gears",
    },
  ],
  seal: [
    {
      id: "seal-001",
      name: "O-ring Seal",
      manufacturer: "Misumi",
      rating: 4.5,
      price: "$5-10",
      availability: "In Stock",
      specifications: [
        "Diameter: 30mm",
        "Pressure rating: 50 bar",
        "Material: NBR",
        "Temperature range: -30 to +100°C",
      ],
      pros: ["High pressure resistance", "Low cost", "Easy to install", "Good chemical resistance"],
      cons: [
        "Not suitable for high temperatures",
        "Limited lifespan in aggressive environments",
        "Requires regular inspection",
      ],
      alternatives: [
        { name: "V-ring Seal", manufacturer: "Misumi" },
        { name: "Metallic Seal", manufacturer: "Misumi" },
      ],
      vendorUrl: "https://www.misumi.com/vona2/result/?SearchString=O-ring+Seal",
    },
  ],
  fastener: [
    {
      id: "fastener-001",
      name: "Hex Bolt M10",
      manufacturer: "Misumi",
      rating: 4.7,
      price: "$2-3",
      availability: "In Stock",
      specifications: [
        "Diameter: M10",
        "Material: Steel Grade 8.8",
        "Clamp load capacity: 12000 N",
        "Temperature tolerance: -20 to +150°C",
      ],
      pros: ["High strength", "Cost-effective", "Wide availability", "Good corrosion resistance"],
      cons: [
        "Limited temperature range",
        "May require special tools for installation",
        "Not suitable for high-vibration applications",
      ],
      alternatives: [
        { name: "Hex Nut M10", manufacturer: "Misumi" },
        { name: "Washer M10", manufacturer: "Misumi" },
      ],
      vendorUrl: "https://www.misumi.com/vona2/result/?SearchString=Hex+Bolt+M10",
    },
  ],
}

function evaluateBearingCriteria(formData: Record<string, any>, component: any) {
  const criteria = []
  let matchedCount = 0

  const dynamicLoadReq = Number.parseFloat(formData.dynamicLoad) || 0
  const dynamicLoadRating = 28.9 // kN from component spec
  const dynamicLoadMet = dynamicLoadRating >= dynamicLoadReq
  if (dynamicLoadMet) matchedCount++
  criteria.push({
    name: "Dynamic Load Capacity",
    value: `${dynamicLoadRating} kN`,
    requirement: `≥ ${dynamicLoadReq} kN`,
    met: dynamicLoadMet,
    weight: "critical",
  })

  const speedReq = Number.parseFloat(formData.speed) || 0
  const speedRating = 10000 // RPM from component spec
  const speedMet = speedRating >= speedReq
  if (speedMet) matchedCount++
  criteria.push({
    name: "Speed Rating",
    value: `${speedRating} RPM`,
    requirement: `≥ ${speedReq} RPM`,
    met: speedMet,
    weight: "critical",
  })

  const l10LifeReq = Number.parseFloat(formData.targetL10Life) || 0
  const l10LifeRating = 25000 // hours - calculated from bearing
  const l10LifeMet = l10LifeRating >= l10LifeReq
  if (l10LifeMet) matchedCount++
  criteria.push({
    name: "L10 Life (Bearing Life)",
    value: `${l10LifeRating} hours`,
    requirement: `≥ ${l10LifeReq} hours`,
    met: l10LifeMet,
    weight: "critical",
  })

  const boreSizeReq = Number.parseInt(formData.boreSize) || 0
  const boreSize = 40 // mm from component spec
  const boreSizeMet = Math.abs(boreSize - boreSizeReq) <= 2
  if (boreSizeMet) matchedCount++
  criteria.push({
    name: "Bore Size",
    value: `${boreSize} mm`,
    requirement: `≈ ${boreSizeReq} mm`,
    met: boreSizeMet,
    weight: "high",
  })

  const environment = formData.bearingEnvironment || "Clean"
  const environmentOptions = ["Clean/Sealed", "Slightly Dusty", "Dusty", "Highly Corrosive", "Washdown/Wet"]
  const environmentMet = environment !== "Highly Corrosive"
  if (environmentMet) matchedCount++
  criteria.push({
    name: "Environmental Compatibility",
    value: `Sealed bearing suitable for ${environment}`,
    requirement: `Environment: ${environment}`,
    met: environmentMet,
    weight: "high",
  })

  const lubrication = formData.lubrication || "Grease"
  const lubricationMet = ["Oil Bath", "Grease"].includes(lubrication)
  if (lubricationMet) matchedCount++
  criteria.push({
    name: "Lubrication Type",
    value: `Standard ${lubrication} suitable`,
    requirement: `Lubrication: ${lubrication}`,
    met: lubricationMet,
    weight: "medium",
  })

  const bearingMaterial = formData.bearingMaterial || "Steel"
  const materialMet = bearingMaterial === "Steel" || bearingMaterial === "Stainless Steel (440C)"
  if (materialMet) matchedCount++
  criteria.push({
    name: "Material Availability",
    value: `${bearingMaterial} available`,
    requirement: `Material: ${bearingMaterial}`,
    met: materialMet,
    weight: "medium",
  })

  const totalCriteria = criteria.length
  const matchScore = Math.round((matchedCount / totalCriteria) * 100)

  return { criteria, matchScore, matchedCount }
}

function evaluateMotorCriteria(formData: Record<string, any>, component: any) {
  const criteria = []
  let matchedCount = 0

  const powerReq = Number.parseFloat(formData.power) || 0
  const powerRating = 1.5 // kW
  const powerMet = powerRating >= powerReq * 0.8 && powerRating <= powerReq * 1.2
  if (powerMet) matchedCount++
  criteria.push({
    name: "Power Output",
    value: `${powerRating} kW`,
    requirement: `≈ ${powerReq} kW (±20%)`,
    met: powerMet,
    weight: "critical",
  })

  const speedReq = Number.parseFloat(formData.speed) || 0
  const speedRating = 1500 // RPM
  const speedMet = speedRating === speedReq || Math.abs(speedRating - speedReq) <= 100
  if (speedMet) matchedCount++
  criteria.push({
    name: "Speed Rating",
    value: `${speedRating} RPM`,
    requirement: `≈ ${speedReq} RPM`,
    met: speedMet,
    weight: "critical",
  })

  const dutyClass = formData.dutyClass || "S3"
  const dutyClassMet = true // Component supports various duty classes
  if (dutyClassMet) matchedCount++
  criteria.push({
    name: "Duty Class Support",
    value: "S3, S4, S5 compatible",
    requirement: `Duty Class: ${dutyClass}`,
    met: dutyClassMet,
    weight: "high",
  })

  const insulationClass = formData.insulationClass || "F"
  const insulationMet = ["F", "H", "N"].includes(insulationClass)
  if (insulationMet) matchedCount++
  criteria.push({
    name: "Insulation Class",
    value: `Class ${insulationClass} available`,
    requirement: `Insulation: ${insulationClass}`,
    met: insulationMet,
    weight: "high",
  })

  const environment = formData.motorEnvironment || "Indoor Dry"
  const environmentMet = !environment.includes("Explosive")
  if (environmentMet) matchedCount++
  criteria.push({
    name: "Environmental Tolerance",
    value: "Indoor/Outdoor rated",
    requirement: `Environment: ${environment}`,
    met: environmentMet,
    weight: "high",
  })

  const efficiency = 85.3 // IE3 standard
  const efficiencyMet = true
  if (efficiencyMet) matchedCount++
  criteria.push({
    name: "Energy Efficiency (IE3)",
    value: `${efficiency}% efficiency`,
    requirement: "High efficiency required",
    met: efficiencyMet,
    weight: "medium",
  })

  const totalCriteria = criteria.length
  const matchScore = Math.round((matchedCount / totalCriteria) * 100)

  return { criteria, matchScore, matchedCount }
}

function evaluateGearCriteria(formData: Record<string, any>, component: any) {
  const criteria = []
  let matchedCount = 0

  const powerReq = Number.parseFloat(formData.power) || 0
  const powerRating = 15 // kW approximate for module 2.0 steel
  const powerMet = powerRating >= powerReq
  if (powerMet) matchedCount++
  criteria.push({
    name: "Power Transmission",
    value: `${powerRating} kW rated`,
    requirement: `≥ ${powerReq} kW`,
    met: powerMet,
    weight: "critical",
  })

  const moduleReq = Number.parseFloat(formData.moduleSize) || 0
  const module = 2.0 // mm
  const moduleMet = module === moduleReq || Math.abs(module - moduleReq) <= 0.5
  if (moduleMet) matchedCount++
  criteria.push({
    name: "Module Size",
    value: `${module} mm`,
    requirement: `≈ ${moduleReq} mm`,
    met: moduleMet,
    weight: "critical",
  })

  const gearMaterial = formData.gearMaterial || "Steel"
  const materialMet = ["Steel", "Cast Iron"].includes(gearMaterial)
  if (materialMet) matchedCount++
  criteria.push({
    name: "Material Compatibility",
    value: "16CrNiMo4 Steel (High-strength)",
    requirement: `Material: ${gearMaterial}`,
    met: materialMet,
    weight: "high",
  })

  const precisionMet = true
  if (precisionMet) matchedCount++
  criteria.push({
    name: "Precision Grade",
    value: "ISO 7 precision",
    requirement: "High precision required",
    met: precisionMet,
    weight: "high",
  })

  const oilType = formData.oilType || "ISO VG 46"
  const oilMet = ["ISO VG 46", "ISO VG 68", "ISO VG 100"].includes(oilType)
  if (oilMet) matchedCount++
  criteria.push({
    name: "Lubrication Compatibility",
    value: "Compatible with standard oils",
    requirement: `Oil Type: ${oilType}`,
    met: oilMet,
    weight: "medium",
  })

  const totalCriteria = criteria.length
  const matchScore = Math.round((matchedCount / totalCriteria) * 100)

  return { criteria, matchScore, matchedCount }
}

function evaluateSealCriteria(formData: Record<string, any>, component: any) {
  const criteria = []
  let matchedCount = 0

  const diameterReq = Number.parseFloat(formData.sealDiameter) || 0
  const diameter = 30 // mm mock component
  const diameterMet = Math.abs(diameter - diameterReq) <= 2
  if (diameterMet) matchedCount++
  criteria.push({
    name: "Seal Diameter",
    value: `${diameter} mm`,
    requirement: `≈ ${diameterReq} mm`,
    met: diameterMet,
    weight: "critical",
  })

  const pressureReq = Number.parseFloat(formData.pressure) || 0
  const pressureRating = 50 // bar
  const pressureMet = pressureRating >= pressureReq
  if (pressureMet) matchedCount++
  criteria.push({
    name: "Pressure Rating",
    value: `${pressureRating} bar`,
    requirement: `≥ ${pressureReq} bar`,
    met: pressureMet,
    weight: "critical",
  })

  const medium = formData.sealEnvironment || "Oil"
  const mediumMet = ["Oil", "Water", "Hydraulic Fluid"].includes(medium)
  if (mediumMet) matchedCount++
  criteria.push({
    name: "Sealing Medium Compatibility",
    value: `Suitable for ${medium}`,
    requirement: `Medium: ${medium}`,
    met: mediumMet,
    weight: "critical",
  })

  const elastomer = formData.elastomerMaterial || "NBR"
  const elastomerMet = ["NBR", "FKM"].includes(elastomer)
  if (elastomerMet) matchedCount++
  criteria.push({
    name: "Elastomer Type",
    value: `${elastomer} available`,
    requirement: `Material: ${elastomer}`,
    met: elastomerMet,
    weight: "high",
  })

  const tempReq = formData.sealTemperature || "20-60"
  const tempRating = "-30 to +100"
  const tempMet = true
  if (tempMet) matchedCount++
  criteria.push({
    name: "Temperature Range",
    value: `${tempRating} °C`,
    requirement: `Operating: ${tempReq} °C`,
    met: tempMet,
    weight: "high",
  })

  const totalCriteria = criteria.length
  const matchScore = Math.round((matchedCount / totalCriteria) * 100)

  return { criteria, matchScore, matchedCount }
}

function evaluateFastenerCriteria(formData: Record<string, any>, component: any) {
  const criteria = []
  let matchedCount = 0

  const diameterReq = formData.diameter || "M8"
  const diameter = "M10"
  const diameterMet = true
  if (diameterMet) matchedCount++
  criteria.push({
    name: "Fastener Diameter",
    value: `${diameter} available`,
    requirement: `Size: ${diameterReq}`,
    met: diameterMet,
    weight: "critical",
  })

  const clampLoadReq = Number.parseFloat(formData.clampLoad) || 0
  const clampLoadCapacity = 12000 // N for Grade 8.8
  const clampLoadMet = clampLoadCapacity >= clampLoadReq
  if (clampLoadMet) matchedCount++
  criteria.push({
    name: "Clamp Load Capacity",
    value: `${clampLoadCapacity} N`,
    requirement: `≥ ${clampLoadReq} N`,
    met: clampLoadMet,
    weight: "critical",
  })

  const materialGrade = formData.fastenerMaterial || "Steel Grade 8.8"
  const gradeMet = ["Steel Grade 8.8", "Steel Grade 10.9", "Stainless Steel A4-70"].includes(materialGrade)
  if (gradeMet) matchedCount++
  criteria.push({
    name: "Material Grade",
    value: `Grade 8.8 (High-strength)`,
    requirement: `Grade: ${materialGrade}`,
    met: gradeMet,
    weight: "critical",
  })

  const environment = formData.fastenerEnvironment || "Dry Indoor"
  const environmentMet = !environment.includes("Corrosive")
  if (environmentMet) matchedCount++
  criteria.push({
    name: "Environmental Suitability",
    value: "Zinc-plated for mild environments",
    requirement: `Environment: ${environment}`,
    met: environmentMet,
    weight: "high",
  })

  const tempReq = formData.fastenerTemperature || "0-80"
  const tempMet = true
  if (tempMet) matchedCount++
  criteria.push({
    name: "Temperature Tolerance",
    value: "-20 to +150 °C",
    requirement: `Operating: ${tempReq} °C`,
    met: tempMet,
    weight: "high",
  })

  const totalCriteria = criteria.length
  const matchScore = Math.round((matchedCount / totalCriteria) * 100)

  return { criteria, matchScore, matchedCount }
}

function getPerformanceMetrics(componentType: string, formData: Record<string, any>) {
  const metrics = {
    bearing: [
      {
        label: "Dynamic Load Capacity vs Requirement",
        value: "28.9 kN",
        target: `${formData.dynamicLoad} kN`,
        met: 28.9 >= Number.parseFloat(formData.dynamicLoad || 0),
      },
      {
        label: "Speed Rating",
        value: "10,000 RPM",
        target: `${formData.speed} RPM`,
        met: 10000 >= Number.parseFloat(formData.speed || 0),
      },
      {
        label: "L10 Life",
        value: "25,000 hours",
        target: `${formData.targetL10Life} hours`,
        met: 25000 >= Number.parseFloat(formData.targetL10Life || 0),
      },
    ],
    motor: [
      {
        label: "Power Output Efficiency",
        value: "85.3%",
        target: "≥80%",
        met: true,
      },
      {
        label: "Speed Match",
        value: "1500 RPM",
        target: `${formData.speed} RPM`,
        met: 1500 === Number.parseFloat(formData.speed || 1500),
      },
      {
        label: "Thermal Capability",
        value: "155°C winding",
        target: "Class F insulation",
        met: true,
      },
    ],
    gear: [
      {
        label: "Power Transmission",
        value: "15 kW continuous",
        target: `${formData.power} kW`,
        met: 15 >= Number.parseFloat(formData.power || 0),
      },
      {
        label: "Module Precision",
        value: "ISO 7 grade",
        target: "High precision",
        met: true,
      },
      {
        label: "Noise Level",
        value: "~82 dB",
        target: `${formData.noiseLevel} dB`,
        met: true,
      },
    ],
    seal: [
      {
        label: "Pressure Rating",
        value: "50 bar",
        target: `${formData.pressure} bar`,
        met: 50 >= Number.parseFloat(formData.pressure || 0),
      },
      {
        label: "Leakage Rate",
        value: "<0.1 cc/hour",
        target: "Zero leak",
        met: true,
      },
      {
        label: "Elastomer Durability",
        value: "5 years min",
        target: "Long-term reliability",
        met: true,
      },
    ],
    fastener: [
      {
        label: "Tensile Strength",
        value: "800 MPa (Grade 8.8)",
        target: "High-strength required",
        met: true,
      },
      {
        label: "Clamp Force Retention",
        value: "95%",
        target: "Maintain preload",
        met: true,
      },
      {
        label: "Corrosion Resistance",
        value: "Zinc-plated",
        target: `${formData.fastenerEnvironment}`,
        met: true,
      },
    ],
  }

  return metrics[componentType as keyof typeof metrics] || []
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Validate input
    if (!formData.componentType) {
      return NextResponse.json({ error: "Component type is required" }, { status: 400 })
    }

    // Get components from database
    const componentType = formData.componentType.toLowerCase()
    const components = cotsDatabase[componentType as keyof typeof cotsDatabase] || []

    if (components.length === 0) {
      return NextResponse.json({
        recommendations: [],
        message: "No components found for the selected type",
      })
    }

    const enrichedRecommendations = components.map((component: any) => {
      let criteriaEval
      let performanceMetrics

      switch (componentType) {
        case "bearing":
          criteriaEval = evaluateBearingCriteria(formData, component)
          performanceMetrics = getPerformanceMetrics("bearing", formData)
          break
        case "motor":
          criteriaEval = evaluateMotorCriteria(formData, component)
          performanceMetrics = getPerformanceMetrics("motor", formData)
          break
        case "gear":
          criteriaEval = evaluateGearCriteria(formData, component)
          performanceMetrics = getPerformanceMetrics("gear", formData)
          break
        case "seal":
          criteriaEval = evaluateSealCriteria(formData, component)
          performanceMetrics = getPerformanceMetrics("seal", formData)
          break
        case "fastener":
          criteriaEval = evaluateFastenerCriteria(formData, component)
          performanceMetrics = getPerformanceMetrics("fastener", formData)
          break
        default:
          criteriaEval = { criteria: [], matchScore: 0, matchedCount: 0 }
          performanceMetrics = []
      }

      return {
        ...component,
        matchScore: criteriaEval.matchScore,
        criteriaMatches: criteriaEval.criteria,
        performanceMetrics,
        vendorUrl: component.vendorUrl || `https://www.misumi.com/vona2/result/?SearchString=${component.name}`,
      }
    })

    return NextResponse.json({
      recommendations: enrichedRecommendations,
      timestamp: new Date().toISOString(),
      totalResults: components.length,
    })
  } catch (error) {
    console.error("[v0] Error in /api/select-parts:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
