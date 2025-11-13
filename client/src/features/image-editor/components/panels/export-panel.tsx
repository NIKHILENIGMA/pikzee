import { Download, FileImage, Settings } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

export function ExportPanel() {
    const [format, setFormat] = useState('PNG')
    const [quality, setQuality] = useState([90])
    const [width, setWidth] = useState(1920)
    const [height, setHeight] = useState(1080)

    const handleDownload = () => {
        // Simulate download process
        // console.log(`Downloading as ${format} with ${quality[0]}% quality`)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Export Settings</h2>
                <p className="text-sm text-muted-foreground mb-6">Configure your export settings and download the final image.</p>
            </div>

            {/* Format Selection */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <FileImage className="w-4 h-4" />
                        <span>File Format</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-2">
                        {['PNG', 'JPG', 'WEBP'].map((fmt) => (
                            <Button
                                key={fmt}
                                variant={format === fmt ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setFormat(fmt)}>
                                {fmt}
                            </Button>
                        ))}
                    </div>

                    <p className="text-xs text-muted-foreground">
                        {format === 'PNG' && 'Best for images with transparency'}
                        {format === 'JPG' && 'Best for photographs and smaller file sizes'}
                        {format === 'WEBP' && 'Modern format with excellent compression'}
                    </p>
                </CardContent>
            </Card>

            {/* Quality Settings */}
            {format !== 'PNG' && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Quality Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground">Compression Quality</Label>
                            <Slider
                                value={quality}
                                onValueChange={setQuality}
                                min={10}
                                max={100}
                                step={5}
                                className="w-full"
                            />
                            <div className="text-xs text-muted-foreground text-right">{quality[0]}%</div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Dimensions */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <Settings className="w-4 h-4" />
                        <span>Dimensions</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Width</Label>
                            <input
                                type="number"
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs text-muted-foreground">Height</Label>
                            <input
                                type="number"
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setWidth(1920)
                                setHeight(1080)
                            }}>
                            1080p
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setWidth(1280)
                                setHeight(720)
                            }}>
                            720p
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setWidth(1080)
                                setHeight(1080)
                            }}>
                            Square
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Download Button */}
            <Card>
                <CardContent className="pt-6">
                    <Button
                        onClick={handleDownload}
                        className="w-full flex items-center space-x-2"
                        size="lg">
                        <Download className="w-5 h-5" />
                        <span>Download {format}</span>
                    </Button>

                    <p className="text-xs text-muted-foreground text-center mt-3">
                        File size: ~{Math.round(((width * height * (format === 'PNG' ? 4 : 3) * (quality[0] / 100)) / 1024 / 1024) * 10) / 10}MB
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
