import { Sparkles, Sun, Moon } from 'lucide-react'
import { useState } from 'react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

export function AIEnhancePanel() {
    const [generalEnhance, setGeneralEnhance] = useState([50])
    const [shadowAdjust, setShadowAdjust] = useState([0])
    const [highlightAdjust, setHighlightAdjust] = useState([0])
    const [autoEnhance, setAutoEnhance] = useState(false)

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">AI Enhancement</h2>
                <p className="text-sm text-muted-foreground mb-6">Use AI-powered tools to automatically improve your image quality.</p>
            </div>

            {/* Auto Enhancement Toggle */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <Sparkles className="w-4 h-4" />
                        <span>Auto Enhancement</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <Label className="text-sm">Enable AI Auto-Enhance</Label>
                        <Switch
                            checked={autoEnhance}
                            onCheckedChange={setAutoEnhance}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Automatically optimize colors, contrast, and sharpness</p>
                </CardContent>
            </Card>

            {/* General Enhancement */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">General Enhancement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Enhancement Strength</Label>
                        <Slider
                            value={generalEnhance}
                            onValueChange={setGeneralEnhance}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-right">{generalEnhance[0]}%</div>
                    </div>
                </CardContent>
            </Card>

            {/* Shadow & Highlight Adjustments */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">Shadow & Highlight</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Moon className="w-3 h-3" />
                            <span>Shadow Adjustment</span>
                        </Label>
                        <Slider
                            value={shadowAdjust}
                            onValueChange={setShadowAdjust}
                            min={-100}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {shadowAdjust[0] > 0 ? '+' : ''}
                            {shadowAdjust[0]}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground flex items-center space-x-1">
                            <Sun className="w-3 h-3" />
                            <span>Highlight Adjustment</span>
                        </Label>
                        <Slider
                            value={highlightAdjust}
                            onValueChange={setHighlightAdjust}
                            min={-100}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {highlightAdjust[0] > 0 ? '+' : ''}
                            {highlightAdjust[0]}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
