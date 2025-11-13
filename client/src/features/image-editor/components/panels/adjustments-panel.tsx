import { Crop, Focus, RotateCcw } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export function AdjustmentsPanel() {
    const [cropMode, setCropMode] = useState(false)
    const [focusValue, setFocusValue] = useState([50])
    const [zoomValue, setZoomValue] = useState([100])

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Basic Adjustments</h2>
                <p className="text-sm text-muted-foreground mb-6">Resize, crop, and adjust focus settings for your image.</p>
            </div>

            {/* Resize & Crop Tool */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <Crop className="w-4 h-4" />
                        <span>Resize & Crop</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant={cropMode ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCropMode(!cropMode)}
                        className="w-full">
                        {cropMode ? 'Exit Crop Mode' : 'Enable Crop Mode'}
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="outline"
                            size="sm">
                            Square
                        </Button>
                        <Button
                            variant="outline"
                            size="sm">
                            16:9
                        </Button>
                        <Button
                            variant="outline"
                            size="sm">
                            4:3
                        </Button>
                        <Button
                            variant="outline"
                            size="sm">
                            Custom
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Focus & Zoom */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <Focus className="w-4 h-4" />
                        <span>Focus & Zoom</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Focus Point</Label>
                        <Slider
                            value={focusValue}
                            onValueChange={setFocusValue}
                            max={100}
                            step={1}
                            className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-right">{focusValue[0]}%</div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Zoom Level</Label>
                        <Slider
                            value={zoomValue}
                            onValueChange={setZoomValue}
                            min={25}
                            max={200}
                            step={5}
                            className="w-full"
                        />
                        <div className="text-xs text-muted-foreground text-right">{zoomValue[0]}%</div>
                    </div>
                </CardContent>
            </Card>

            {/* Reset All */}
            <Card>
                <CardContent className="pt-6">
                    <Button
                        variant="destructive"
                        size="sm"
                        className="w-full flex items-center space-x-2">
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset All Changes</span>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
