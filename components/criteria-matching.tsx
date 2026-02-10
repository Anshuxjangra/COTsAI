"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, TrendingUp } from "lucide-react"

interface CriteriaMatch {
  name: string
  value: string | number
  requirement: string
  met: boolean
  weight: "critical" | "high" | "medium" | "low"
}

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
  alternatives: Array<{ name: string; manufacturer: string }>
  matchScore: number
  criteriaMatches: CriteriaMatch[]
  performanceMetrics: {
    label: string
    value: string
    target: string
    met: boolean
  }[]
}

interface CriteriaMatchingProps {
  componentType: string
  formData: Record<string, string | number>
  results: PartRecommendation[]
  loading: boolean
}

export function CriteriaMatching({ componentType, formData, results, loading }: CriteriaMatchingProps) {
  if (results.length === 0 || loading) return null

  const optimalComponent = results[0]
  const alternativeComponents = results.slice(1)

  const totalCriteria = optimalComponent.criteriaMatches.length
  const metCriteria = optimalComponent.criteriaMatches.filter((c) => c.met).length
  const criticalMissed = optimalComponent.criteriaMatches.filter((c) => !c.met && c.weight === "critical")

  const criticalCriteria = optimalComponent.criteriaMatches.filter((c) => c.weight === "critical")
  const highCriteria = optimalComponent.criteriaMatches.filter((c) => c.weight === "high")
  const mediumCriteria = optimalComponent.criteriaMatches.filter((c) => c.weight === "medium")
  const lowCriteria = optimalComponent.criteriaMatches.filter((c) => c.weight === "low")

  return (
    <div className="space-y-8">
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Criteria Matching Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Total Criteria</p>
              <p className="text-3xl font-bold text-foreground">{totalCriteria}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/20 p-4 rounded-lg border border-green-200 dark:border-green-900">
              <p className="text-sm text-green-700 dark:text-green-400">Criteria Met</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {metCriteria}/{totalCriteria}
              </p>
            </div>
            <div className="bg-background p-4 rounded-lg border">
              <p className="text-sm text-muted-foreground">Match Score</p>
              <p className="text-3xl font-bold text-primary">{optimalComponent.matchScore}%</p>
            </div>
            {criticalMissed.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900">
                <p className="text-sm text-amber-700 dark:text-amber-400">Critical Issues</p>
                <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">{criticalMissed.length}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {criticalCriteria.length > 0 && (
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader className="bg-red-50 dark:bg-red-950/20 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                Critical Requirements ({criticalCriteria.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {criticalCriteria.map((criteria, idx) => (
                  <CriteriaItem key={idx} criteria={criteria} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {highCriteria.length > 0 && (
          <Card>
            <CardHeader className="bg-blue-50 dark:bg-blue-950/20 border-b">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                High Priority Requirements ({highCriteria.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {highCriteria.map((criteria, idx) => (
                  <CriteriaItem key={idx} criteria={criteria} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {mediumCriteria.length > 0 && (
          <Card>
            <CardHeader className="bg-amber-50 dark:bg-amber-950/20 border-b">
              <CardTitle className="text-base">Medium Priority Requirements ({mediumCriteria.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {mediumCriteria.map((criteria, idx) => (
                  <CriteriaItem key={idx} criteria={criteria} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {lowCriteria.length > 0 && (
          <Card>
            <CardHeader className="bg-gray-50 dark:bg-gray-950/20 border-b">
              <CardTitle className="text-base">Low Priority Requirements ({lowCriteria.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {lowCriteria.map((criteria, idx) => (
                  <CriteriaItem key={idx} criteria={criteria} />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {optimalComponent.performanceMetrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {optimalComponent.performanceMetrics.map((metric, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{metric.label}</span>
                    <span className="text-sm font-bold text-primary">{metric.value}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Target: {metric.target}</span>
                    {metric.met ? (
                      <span className="text-green-600 font-semibold">✓ Met</span>
                    ) : (
                      <span className="text-amber-600 font-semibold">⚠ Close</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {alternativeComponents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alternative Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alternativeComponents.map((component, idx) => (
                <div
                  key={component.id}
                  className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{component.name}</p>
                    <p className="text-sm text-muted-foreground">{component.manufacturer}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">{component.price}</Badge>
                      <Badge variant="outline">{component.availability}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{component.matchScore}%</p>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function CriteriaItem({ criteria }: { criteria: CriteriaMatch }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
      {criteria.met ? (
        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-medium text-foreground">{criteria.name}</p>
          <Badge variant="outline" className="text-xs">
            {criteria.weight}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">Requirement: {criteria.requirement}</p>
        <p className={`text-sm font-medium ${criteria.met ? "text-green-600" : "text-red-600"}`}>
          Your Input: {criteria.value}
        </p>
      </div>
    </div>
  )
}
