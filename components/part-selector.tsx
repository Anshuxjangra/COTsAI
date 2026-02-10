"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CriteriaMatching } from "./criteria-matching"
import { ShoppingCart } from "./shopping-cart"
import { ShoppingBag, ExternalLink, Download } from "lucide-react"

interface PartRecommendation {
  id: string
  name: string
  manufacturer: string
  rating: number
  price: string
  availability: string
  specifications: string[]
  pros: string[]
  cons: string[]
  alternatives: Array<{
    name: string
    manufacturer: string
  }>
  matchScore: number
  criteriaMatches: Array<{
    name: string
    value: string | number
    requirement: string
    met: boolean
    weight: "critical" | "high" | "medium" | "low"
  }>
  performanceMetrics: Array<{
    label: string
    value: string
    target: string
    met: boolean
  }>
}

interface FormData {
  componentType: string
  [key: string]: string
}

const componentConfigs = {
  motor: {
    label: "Motor",
    description: "Power and efficiency calculations",
    designParams: [
      { field: "power", label: "Power Output (kW) *", placeholder: "e.g., 5.5, 15" },
      { field: "speed", label: "Speed (RPM) *", placeholder: "e.g., 1500, 3000" },
      { field: "poles", label: "Number of Poles *", placeholder: "e.g., 2, 4, 6, 8" },
      { field: "dutyClass", label: "Duty Class", placeholder: "e.g., S3 (Intermittent), S5 (Continuous)" },
      { field: "insulationClass", label: "Insulation Class *", placeholder: "e.g., F, H, N" },
    ],
    environmentParams: [
      {
        field: "motorEnvironment",
        label: "Operating Environment *",
        type: "select",
        options: ["Indoor Dry", "Indoor Humid", "Outdoor Wet", "Corrosive Atmosphere", "Explosive Atmosphere (ATEX)"],
      },
      { field: "motorTemperature", label: "Ambient Temperature Range °C *", placeholder: "e.g., -20 to +60" },
      { field: "mountingPosition", label: "Mounting Position *", placeholder: "e.g., Horizontal, Vertical, Any" },
      { field: "coolingMethod", label: "Cooling Method", placeholder: "e.g., Natural (IC0), Fan-cooled (IC4)" },
    ],
    materialParams: [
      {
        field: "motorMaterial",
        label: "Frame Material *",
        type: "select",
        options: ["Cast Iron (Heavy)", "Aluminum Alloy (Lightweight)", "Stainless Steel (Corrosion-resistant)"],
      },
      { field: "rodMaterial", label: "Rotor Rod Material", type: "select", options: ["Aluminum", "Copper", "Brass"] },
      { field: "finishType", label: "Surface Finish", placeholder: "e.g., Painted, Epoxy, Anodized" },
    ],
  },
  bearing: {
    label: "Bearing",
    description: "L10 life and reliability analysis",
    designParams: [
      { field: "dynamicLoad", label: "Dynamic Load (N) *", placeholder: "e.g., 5000" },
      { field: "staticLoad", label: "Static Load (N) *", placeholder: "e.g., 2000" },
      { field: "speed", label: "Speed (RPM) *", placeholder: "e.g., 1500" },
      { field: "boreSize", label: "Bore Size (mm) *", placeholder: "e.g., 15, 20, 25" },
      { field: "targetL10Life", label: "Target L10 Life (hours) *", placeholder: "e.g., 10000, 25000, 50000" },
    ],
    environmentParams: [
      {
        field: "bearingEnvironment",
        label: "Operating Environment *",
        type: "select",
        options: ["Clean/Sealed", "Slightly Dusty", "Dusty", "Highly Corrosive", "Washdown/Wet"],
      },
      { field: "bearingTemperature", label: "Operating Temperature °C *", placeholder: "e.g., -10 to +70" },
      {
        field: "lubrication",
        label: "Lubrication Type *",
        type: "select",
        options: ["Oil Bath", "Grease", "Oil-Air", "Dry"],
      },
      { field: "relubrication", label: "Relubrication Interval", placeholder: "e.g., 500 hours, 1000 hours, N/A" },
    ],
    materialParams: [
      {
        field: "bearingMaterial",
        label: "Bearing Material *",
        type: "select",
        options: ["Steel (52100, 100Cr6)", "Ceramic Hybrid", "Stainless Steel (440C)"],
      },
      {
        field: "cageMaterial",
        label: "Cage Material",
        type: "select",
        options: ["Brass", "Steel", "Nylon (PA66)", "Bronze"],
      },
      {
        field: "sealType",
        label: "Seal Type *",
        type: "select",
        options: ["Open (No seal)", "Metal Shield", "Rubber Seal (2RS)", "Contact Seal (2RZ)"],
      },
    ],
  },
  gear: {
    label: "Gear",
    description: "Tooth stress and efficiency analysis",
    designParams: [
      { field: "power", label: "Power (kW) *", placeholder: "e.g., 10, 50" },
      { field: "inputSpeed", label: "Input Speed (RPM) *", placeholder: "e.g., 1500" },
      { field: "gearRatio", label: "Gear Ratio *", placeholder: "e.g., 2:1, 5:1, 10:1" },
      { field: "toothCount", label: "Pinion Tooth Count *", placeholder: "e.g., 12, 15, 20" },
      { field: "moduleSize", label: "Module Size (mm) *", placeholder: "e.g., 1.5, 2, 2.5, 3" },
    ],
    environmentParams: [
      {
        field: "gearEnvironment",
        label: "Operating Environment *",
        type: "select",
        options: ["Industrial Clean", "Industrial Dusty", "High Humidity", "Corrosive/Salt Spray", "High Vibration"],
      },
      { field: "gearTemperature", label: "Operating Temperature °C *", placeholder: "e.g., -10 to +100" },
      {
        field: "oilType",
        label: "Lubricant Type *",
        type: "select",
        options: ["ISO VG 46", "ISO VG 68", "ISO VG 100", "Synthetic (PAO)", "Biodegradable"],
      },
      { field: "noiseLevel", label: "Max Noise Level (dB)", placeholder: "e.g., 70, 80, 90" },
    ],
    materialParams: [
      {
        field: "gearMaterial",
        label: "Gear Body Material *",
        type: "select",
        options: ["Cast Iron", "Steel (16MnCr5 carburized)", "Aluminum (for light loads)", "Bronze"],
      },
      {
        field: "shaftMaterial",
        label: "Shaft Material *",
        type: "select",
        options: ["Steel (C45)", "Alloy Steel (42CrMo4)", "Stainless Steel"],
      },
      {
        field: "surfaceTreatment",
        label: "Surface Treatment",
        type: "select",
        options: ["None", "Carburizing", "Nitriding", "Hardening", "Coating"],
      },
    ],
  },
  seal: {
    label: "Seal",
    description: "Pressure and compatibility verification",
    designParams: [
      { field: "sealDiameter", label: "Seal Diameter (mm) *", placeholder: "e.g., 20, 30, 40" },
      { field: "shaftSpeed", label: "Shaft Speed (m/s or RPM) *", placeholder: "e.g., 5 m/s or 1500 RPM" },
      { field: "pressure", label: "Operating Pressure (bar) *", placeholder: "e.g., 10, 50, 100" },
      { field: "sealWidth", label: "Seal Width (mm)", placeholder: "e.g., 8, 10, 12" },
      { field: "gland", label: "Gland Type", placeholder: "e.g., Stationary, Rotating" },
    ],
    environmentParams: [
      {
        field: "sealEnvironment",
        label: "Medium Being Sealed *",
        type: "select",
        options: ["Oil", "Water", "Gas", "Hydraulic Fluid", "Chemical (specify)", "Steam", "Air"],
      },
      { field: "sealTemperature", label: "Fluid Temperature °C *", placeholder: "e.g., -20 to +100" },
      { field: "ph", label: "pH Range (if water/chemical)", placeholder: "e.g., 5-9" },
      {
        field: "chemicalCompatibility",
        label: "Chemical Compatibility",
        placeholder: "e.g., Mineral oil, Water, Acetone",
      },
    ],
    materialParams: [
      {
        field: "elastomerMaterial",
        label: "Elastomer Material *",
        type: "select",
        options: ["NBR (Nitrile)", "FKM (Viton)", "FFKM (Kalrez)", "PTFE (Teflon)", "Silicone (VMQ)"],
      },
      {
        field: "springMaterial",
        label: "Spring Material *",
        type: "select",
        options: ["Stainless Steel 304", "Stainless Steel 316", "Carbon Steel", "Inconel"],
      },
      {
        field: "faceContact",
        label: "Face Contact Material",
        type: "select",
        options: ["Carbon on Ceramic", "Tungsten Carbide", "Silicon Carbide"],
      },
    ],
  },
  fastener: {
    label: "Fastener",
    description: "Tensile strength and thread analysis",
    designParams: [
      { field: "diameter", label: "Diameter (mm) *", placeholder: "e.g., M6, M8, M10" },
      { field: "threadPitch", label: "Thread Pitch (mm)", placeholder: "e.g., 1.0, 1.5 (coarse), 0.75, 1.25 (fine)" },
      { field: "clampLoad", label: "Clamp Load / Joint Load (N) *", placeholder: "e.g., 1000, 5000" },
      { field: "preloadPercentage", label: "Preload % of Tensile Strength", placeholder: "e.g., 50, 75, 90" },
      { field: "fastenerLength", label: "Fastener Length (mm) *", placeholder: "e.g., 20, 30, 40" },
    ],
    environmentParams: [
      {
        field: "fastenerEnvironment",
        label: "Operating Environment *",
        type: "select",
        options: ["Dry Indoor", "Humid", "High Vibration", "Corrosive/Salt Spray", "Underwater", "Underground"],
      },
      { field: "fastenerTemperature", label: "Operating Temperature °C *", placeholder: "e.g., -20 to +150" },
      {
        field: "dynamicLoading",
        label: "Loading Type *",
        type: "select",
        options: ["Static", "Cyclic Low Amplitude", "Cyclic High Amplitude", "Shock/Impact"],
      },
      { field: "cycleCount", label: "Expected Cycle Count", placeholder: "e.g., 10000, 100000, 1000000" },
    ],
    materialParams: [
      {
        field: "fastenerMaterial",
        label: "Material Grade *",
        type: "select",
        options: [
          "Steel Grade 4.6",
          "Steel Grade 5.8",
          "Steel Grade 8.8",
          "Steel Grade 10.9",
          "Stainless Steel A2-50",
          "Stainless Steel A4-70",
          "Brass",
          "Titanium",
        ],
      },
      {
        field: "surface",
        label: "Surface Treatment",
        type: "select",
        options: ["Zinc Plated", "Hot Dip Galvanized", "Stainless (as-is)", "Phosphate + Oil", "Ceramic Coating"],
      },
      {
        field: "antiSeize",
        label: "Anti-Seize Required",
        type: "select",
        options: ["None", "Dry Film", "Molybdenum Disulfide", "Copper-based", "Silver-based"],
      },
    ],
  },
}

function PartSelector() {
  const [formData, setFormData] = useState<FormData>({
    componentType: "",
  })

  const [results, setResults] = useState<PartRecommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSubmitted(true)

    try {
      const response = await fetch("/api/select-parts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to get recommendations")
      }

      const data = await response.json()
      setResults(data.recommendations)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      console.log("[v0] Error fetching recommendations:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (part: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === part.id)
      if (existing) {
        return prev.map((item) => (item.id === part.id ? { ...item, quantity: item.quantity + 1 } : item))
      }
      return [...prev, { ...part, quantity: 1, componentType: formData.componentType }]
    })
  }

  const handleDownloadSpecs = async (component: any) => {
    try {
      const response = await fetch("/api/download-specs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          componentName: component.name,
          manufacturer: component.manufacturer,
          specifications: component.specifications,
          criteriaMatches: component.criteriaMatches,
          performanceMetrics: component.performanceMetrics,
          componentType: formData.componentType,
        }),
      })

      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${component.name}-specs-${Date.now()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Download error:", error)
      alert("Failed to download specs. Please try again.")
    }
  }

  const handleDownloadBOM = async () => {
    try {
      const components = results.map((comp, idx) => ({
        name: comp.name,
        manufacturer: comp.manufacturer,
        price: comp.price,
        availability: comp.availability,
        quantity: 1,
        vendorUrl: comp.vendorUrl,
      }))

      const response = await fetch("/api/download-bom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          components,
          projectName: "COTS-Selection",
        }),
      })

      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `BOM-COTS-Selection-${Date.now()}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] BOM download error:", error)
      alert("Failed to download BOM. Please try again.")
    }
  }

  const currentConfig = formData.componentType
    ? componentConfigs[formData.componentType as keyof typeof componentConfigs]
    : null

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Component Requirements</CardTitle>
          <CardDescription>Specify your design parameters and let AI recommend optimal COTS components</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Component Type Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                  1
                </div>
                <h3 className="font-semibold text-lg">Select Component Type</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                {Object.entries(componentConfigs).map(([key, config]) => (
                  <Button
                    key={key}
                    type="button"
                    variant={formData.componentType === key ? "default" : "outline"}
                    className="h-auto flex flex-col items-center justify-center py-4 px-2"
                    onClick={() => handleSelectChange("componentType", key)}
                  >
                    <span className="font-semibold">{config.label}</span>
                    <span className="text-xs text-muted-foreground mt-1">{config.description}</span>
                  </Button>
                ))}
              </div>
            </div>

            {currentConfig && (
              <>
                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                      2
                    </div>
                    <h3 className="font-semibold text-lg">Design Parameters for {currentConfig.label}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentConfig.designParams.map((param) => (
                      <div key={param.field} className="space-y-2">
                        <Label htmlFor={param.field}>{param.label}</Label>
                        <Input
                          id={param.field}
                          name={param.field}
                          type="text"
                          placeholder={param.placeholder}
                          value={formData[param.field] || ""}
                          onChange={handleInputChange}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                      3
                    </div>
                    <h3 className="font-semibold text-lg">Environmental Requirements for {currentConfig.label}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentConfig.environmentParams.map((param) => (
                      <div key={param.field} className="space-y-2">
                        <Label htmlFor={param.field}>{param.label}</Label>
                        {param.type === "select" ? (
                          <Select
                            value={formData[param.field] || ""}
                            onValueChange={(val) => handleSelectChange(param.field, val)}
                          >
                            <SelectTrigger id={param.field}>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              {param.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={param.field}
                            name={param.field}
                            type="text"
                            placeholder={param.placeholder}
                            value={formData[param.field] || ""}
                            onChange={handleInputChange}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                      4
                    </div>
                    <h3 className="font-semibold text-lg">Material Requirements for {currentConfig.label}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentConfig.materialParams.map((param) => (
                      <div key={param.field} className="space-y-2">
                        <Label htmlFor={param.field}>{param.label}</Label>
                        {param.type === "select" ? (
                          <Select
                            value={formData[param.field] || ""}
                            onValueChange={(val) => handleSelectChange(param.field, val)}
                          >
                            <SelectTrigger id={param.field}>
                              <SelectValue placeholder="Select option" />
                            </SelectTrigger>
                            <SelectContent>
                              {param.options?.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Input
                            id={param.field}
                            name={param.field}
                            type="text"
                            placeholder={param.placeholder}
                            value={formData[param.field] || ""}
                            onChange={handleInputChange}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold">
                      5
                    </div>
                    <h3 className="font-semibold text-lg">Budget & Preferences</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget per Unit ($) *</Label>
                      <Input
                        id="budget"
                        name="budget"
                        type="text"
                        placeholder="e.g., 50, 500, 2000"
                        value={formData.budget || ""}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sustainability">Sustainability Priority</Label>
                      <Select
                        value={formData.sustainability || ""}
                        onValueChange={(val) => handleSelectChange("sustainability", val)}
                      >
                        <SelectTrigger id="sustainability">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="high">High - Eco-friendly focus</SelectItem>
                          <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                          <SelectItem value="low">Low - Cost/performance focus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalRequirements">Additional Notes & Preferred Vendors</Label>
                    <Textarea
                      id="additionalRequirements"
                      name="additionalRequirements"
                      placeholder="Any special requirements, preferred vendors (SKF, NTN, Siemens, Festo, Parker, MISUMI), certifications, etc."
                      value={formData.additionalRequirements || ""}
                      onChange={handleInputChange}
                      rows={3}
                    />
                  </div>
                </div>
              </>
            )}

            <Button type="submit" size="lg" disabled={loading || !formData.componentType} className="w-full">
              {loading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Running Engineering Analysis...
                </>
              ) : (
                "Find Optimal Components"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Criteria Matching Section */}
      {submitted && (
        <CriteriaMatching
          componentType={formData.componentType}
          formData={formData}
          results={results}
          loading={loading}
        />
      )}

      {/* Results Section */}
      {submitted && results.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Top {results.length} Recommended Components</h2>
              <p className="text-muted-foreground">Ranked by performance, cost, availability, and sustainability</p>
            </div>
            <Button onClick={() => setCartOpen(true)} className="relative">
              <ShoppingBag className="w-5 h-5 mr-2" />
              Cart ({cartItems.length})
            </Button>
          </div>

          {results.map((part, index) => (
            <Card key={part.id} className="overflow-hidden">
              <CardHeader className="bg-accent/5 border-b">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        #{index + 1}
                      </Badge>
                      <div>
                        <CardTitle className="text-xl">{part.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{part.manufacturer}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{part.rating}/5</div>
                    <p className="text-sm text-muted-foreground">Match Rating</p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Price per Unit</p>
                    <p className="text-2xl font-bold text-foreground">{part.price}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Availability</p>
                    <p className="text-2xl font-bold text-foreground">{part.availability}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground">Lead Time</p>
                    <p className="text-2xl font-bold text-foreground">1-2 weeks</p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="mb-6">
                  <h3 className="font-semibold text-foreground mb-3">Key Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {part.specifications.map((spec, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="text-primary mt-1">✓</div>
                        <p className="text-sm text-foreground">{spec}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="text-green-600">✓</span> Advantages
                    </h3>
                    <ul className="space-y-2">
                      {part.pros.map((pro, i) => (
                        <li key={i} className="text-sm text-foreground flex gap-2">
                          <span className="text-green-600 flex-shrink-0">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <span className="text-amber-600">!</span> Considerations
                    </h3>
                    <ul className="space-y-2">
                      {part.cons.map((con, i) => (
                        <li key={i} className="text-sm text-foreground flex gap-2">
                          <span className="text-amber-600 flex-shrink-0">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Alternatives */}
                {part.alternatives.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-foreground mb-3">Alternative Options</h3>
                    <div className="flex flex-wrap gap-2">
                      {part.alternatives.map((alt, i) => (
                        <Badge key={i} variant="secondary">
                          {alt.name} ({alt.manufacturer})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  {index === 0 && (
                    <div className="flex gap-3 w-full">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => {
                          window.open(part.vendorUrl || "#", "_blank")
                        }}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Buy Now on Vendor Site
                      </Button>
                      <Button className="flex-1 bg-transparent" variant="outline" onClick={() => handleAddToCart(part)}>
                        Add to Cart
                      </Button>
                    </div>
                  )}
                  {index > 0 && (
                    <div className="flex gap-3 w-full">
                      <Button className="flex-1 bg-transparent" variant="outline" onClick={() => handleAddToCart(part)}>
                        Add to Cart
                      </Button>
                      <Button
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                          window.open(part.vendorUrl || "#", "_blank")
                        }}
                      >
                        View on Vendor
                      </Button>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full mt-3 bg-transparent"
                  variant="outline"
                  onClick={() => handleDownloadSpecs(part)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Detailed Specs & Datasheet
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {submitted && results.length === 0 && !loading && !error && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              No components found matching your criteria. Try adjusting your requirements.
            </p>
            <Button onClick={() => setSubmitted(false)}>Modify Search</Button>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && (
        <div className="mt-6 flex gap-2">
          <Button onClick={handleDownloadBOM} className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Download Complete BOM
          </Button>
        </div>
      )}

      <ShoppingCart open={cartOpen} onOpenChange={setCartOpen} />
    </div>
  )
}

export { PartSelector }
