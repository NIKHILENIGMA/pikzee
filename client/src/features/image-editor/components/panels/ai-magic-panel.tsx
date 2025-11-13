import { Scissors, Crop, Lightbulb, Wand2 } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'

export function AIMagicPanel() {
    const [backgroundRemoval, setBackgroundRemoval] = useState(false)
    const [shadowIntensity, setShadowIntensity] = useState([50])
    const [lightingAdjust, setLightingAdjust] = useState([0])
    const [processing, setProcessing] = useState(false)

    const handleAICrop = () => {
        setProcessing(true)
        // Simulate AI processing
        setTimeout(() => setProcessing(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">AI Magic Tools</h2>
                <p className="text-sm text-muted-foreground mb-6">Advanced AI-powered features for professional image editing.</p>
            </div>

            {/* Background Removal */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <Scissors className="w-4 h-4" />
                        <span>Background Removal</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between mb-4">
                        <Label className="text-sm">Remove Background</Label>
                        <Switch
                            checked={backgroundRemoval}
                            onCheckedChange={setBackgroundRemoval}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mb-4">Automatically detect and remove the background from your image</p>
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        disabled={!backgroundRemoval}>
                        <Wand2 className="w-4 h-4 mr-2" />
                        Process Background
                    </Button>
                </CardContent>
            </Card>

            {/* AI Cropping */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <Crop className="w-4 h-4" />
                        <span>AI Smart Crop</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">Let AI automatically find the best crop for your image</p>
                    <Button
                        onClick={handleAICrop}
                        disabled={processing}
                        className="w-full">
                        {processing ? (
                            <>
                                <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Apply AI Crop
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Shadows & Lighting */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4" />
                        <span>Shadows & Lighting</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Shadow Intensity</Label>
                        <Slider
                            value={shadowIntensity}
                            onValueChange={setShadowIntensity}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-right">{shadowIntensity[0]}%</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Lighting Adjustment</Label>
                        <Slider
                            value={lightingAdjust}
                            onValueChange={setLightingAdjust}
                            min={-100}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-right">
                            {lightingAdjust[0] > 0 ? '+' : ''}
                            {lightingAdjust[0]}
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent">
                        <Wand2 className="w-4 h-4 mr-2" />
                        Auto-Adjust Lighting
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
