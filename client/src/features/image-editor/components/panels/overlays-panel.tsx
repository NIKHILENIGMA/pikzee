import { ImageIcon, Type, Palette, Upload } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function OverlaysPanel() {
    const [textOverlay, setTextOverlay] = useState('')
    const [backgroundColor, setBackgroundColor] = useState('#ffffff')

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">Overlays & Elements</h2>
                <p className="text-sm text-muted-foreground mb-6">Add images, text, and background elements to your composition.</p>
            </div>

            {/* Add Image */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <ImageIcon className="w-4 h-4" />
                        <span>Add Image</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button
                        variant="outline"
                        className="w-full flex items-center space-x-2 bg-transparent">
                        <Upload className="w-4 h-4" />
                        <span>Upload Image Overlay</span>
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="X Position"
                            type="number"
                        />
                        <Input
                            placeholder="Y Position"
                            type="number"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Width"
                            type="number"
                        />
                        <Input
                            placeholder="Height"
                            type="number"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Add Text */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <Type className="w-4 h-4" />
                        <span>Add Text</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Text Content</Label>
                        <Textarea
                            placeholder="Enter your text here..."
                            value={textOverlay}
                            onChange={(e) => setTextOverlay(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <Input
                            placeholder="Font Size"
                            type="number"
                            defaultValue="24"
                        />
                        <select className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors">
                            <option>Arial</option>
                            <option>Helvetica</option>
                            <option>Times New Roman</option>
                            <option>Georgia</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            variant="outline"
                            size="sm">
                            Bold
                        </Button>
                        <Button
                            variant="outline"
                            size="sm">
                            Italic
                        </Button>
                        <Button
                            variant="outline"
                            size="sm">
                            Center
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Background */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center space-x-2">
                        <Palette className="w-4 h-4" />
                        <span>Background</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Solid Color</Label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="color"
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                className="w-12 h-9 rounded border border-input"
                            />
                            <Input
                                value={backgroundColor}
                                onChange={(e) => setBackgroundColor(e.target.value)}
                                placeholder="#ffffff"
                            />
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full bg-transparent">
                        Apply Gradient Background
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
