"use client"

import type React from "react"

import { useState } from "react"
import { useSettings } from "@/context/settings-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function SettingsForm() {
  const { settings, updateSettings } = useSettings()
  const { toast } = useToast()
  const [formState, setFormState] = useState(settings)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateSettings(formState)
    toast({
      title: "Settings updated",
      description: "Your investment preferences have been saved",
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="investment">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="investment">Investment Preferences</TabsTrigger>
          <TabsTrigger value="app">App Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="investment" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Types</CardTitle>
              <CardDescription>
                Select which asset types you want to include in your investment strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="stocks"
                  checked={formState.assetTypes.stocks}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({
                      ...prev,
                      assetTypes: {
                        ...prev.assetTypes,
                        stocks: checked === true,
                      },
                    }))
                  }
                />
                <Label htmlFor="stocks">Stocks</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="etfs"
                  checked={formState.assetTypes.etfs}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({
                      ...prev,
                      assetTypes: {
                        ...prev.assetTypes,
                        etfs: checked === true,
                      },
                    }))
                  }
                />
                <Label htmlFor="etfs">ETFs</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="crypto"
                  checked={formState.assetTypes.crypto}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({
                      ...prev,
                      assetTypes: {
                        ...prev.assetTypes,
                        crypto: checked === true,
                      },
                    }))
                  }
                />
                <Label htmlFor="crypto">Cryptocurrencies</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Level</CardTitle>
              <CardDescription>Set your risk tolerance for investment recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formState.riskLevel}
                onValueChange={(value) =>
                  setFormState((prev) => ({
                    ...prev,
                    riskLevel: value as "low" | "medium" | "high",
                  }))
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="risk-low" />
                  <Label htmlFor="risk-low">Low Risk</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="risk-medium" />
                  <Label htmlFor="risk-medium">Medium Risk</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="risk-high" />
                  <Label htmlFor="risk-high">High Risk</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Undervaluation Threshold</CardTitle>
              <CardDescription>Set the minimum undervaluation percentage for asset recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Threshold: {formState.undervaluationThreshold}%</Label>
                </div>
                <Slider
                  value={[formState.undervaluationThreshold]}
                  min={5}
                  max={50}
                  step={1}
                  onValueChange={(value) =>
                    setFormState((prev) => ({
                      ...prev,
                      undervaluationThreshold: value[0],
                    }))
                  }
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5%</span>
                  <span>25%</span>
                  <span>50%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget Settings</CardTitle>
              <CardDescription>Configure your investment budget limits</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="max-budget">Maximum Budget per Trade ($)</Label>
                <Input
                  id="max-budget"
                  type="number"
                  value={formState.maxBudgetPerTrade}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      maxBudgetPerTrade: Number.parseFloat(e.target.value),
                    }))
                  }
                  min={10}
                  step={10}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation</CardTitle>
              <CardDescription>Configure automatic investment settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="auto-invest">Auto-Invest</Label>
                <Switch
                  id="auto-invest"
                  checked={formState.autoInvest}
                  onCheckedChange={(checked) =>
                    setFormState((prev) => ({
                      ...prev,
                      autoInvest: checked,
                    }))
                  }
                />
              </div>
              <p className="text-sm text-muted-foreground">
                When enabled, the system will automatically invest in assets that meet your criteria
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6">
        <Button type="submit">Save Settings</Button>
      </div>
    </form>
  )
}
