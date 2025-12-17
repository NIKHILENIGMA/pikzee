import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
// import { FaYoutube } from 'react-icons/fa'
import { useDropzone } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { completeUpload, generateResumableUploadUrl } from '@/features/settings/apis/integrate-api'
import { VideoIcon, UploadIcon, LibraryIcon } from '@/shared/assets/icons'

const platformLimits = {
    youtube: { title: 100, description: 5000 }
}

type FormValues = {
    title: string
    description: string
    visibility: 'public' | 'private'
}

export default function MediaScheduler() {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)

    // React Hook Form setup
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            title: '',
            description: '',
            visibility: 'public'
        }
    })

    useEffect(() => {
        if (!file) {
            setPreviewUrl(null)
            return
        }
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        return () => {
            URL.revokeObjectURL(url)
        }
    }, [file])

    // Drag-and-drop handler via react-dropzone
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0]
        if (!uploadedFile) return
        if (!uploadedFile.type.startsWith('video/')) {
            setError('Please upload a valid video file.')
            return
        }
        setError(null)
        setFile(uploadedFile)
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        onDrop,
        accept: {
            'video/*': ['.mp4', '.mov', '.avi', '.webm']
        },
        multiple: false
    })

    const onSubmit = async (values: FormValues) => {
        try {
            if (!file) {
                setError('Please select a video to upload.')
                return
            }

            setIsUploading(true)
            setUploadProgress(0)
            setError(null)

            // 1️⃣ Generate resumable upload URL
            const { uploadUrl, uploadId } = await generateResumableUploadUrl({
                title: values.title,
                description: values.description,
                privacy: values.visibility,
                fileSize: file.size
            })
            if (!uploadUrl || !uploadId) {
                throw new Error('Failed to generate upload URL.')
            }

            // 2️⃣ Upload the file (PUT)
            const uploadResponse = await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type,
                    'Content-Length': file.size
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                    setUploadProgress(percent)
                },
                withCredentials: true
            })

            // 3️⃣ Extract YouTube video ID from header
            const locationHeader = uploadResponse.headers['location'] || ''
            const videoIdMatch = locationHeader.match(/v=([^&]+)/)
            const youtubeVideoId = videoIdMatch ? videoIdMatch[1] : undefined

            // 4️⃣ Mark complete in backend
            await completeUpload({ uploadId, videoId: youtubeVideoId })

            toast.success('✅ Video uploaded successfully!')
        } catch (err) {
            //   console.error(err)
            setError((err as Error).message || 'Upload failed.')

            // update backend as failed
            try {
                await completeUpload({ uploadId: '', videoId: '', error: (err as Error).message })
            } catch {
                // ignore
            }
        } finally {
            setIsUploading(false)
        }
    }

    const title = watch('title')
    const description = watch('description')

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex h-screen">
                {/* Left Section: Preview */}
                <div className="w-[70%] p-6 flex flex-col">
                    {error && <p className="w-full text-red-500 text-sm mt-3 text-center">{error}</p>}
                    <div className="mb-6">
                        <Tabs value={'youtube'}>
                            <TabsList className="grid w-full grid-cols-1 h-12">
                                <TabsTrigger
                                    value="youtube"
                                    className="flex items-center gap-2 text-sm">
                                    <VideoIcon />
                                    YouTube
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    <div
                        {...getRootProps()}
                        className={`flex-1 rounded-lg border-2 border-dashed p-8 flex flex-col items-center justify-center min-h-[500px] transition-colors cursor-pointer ${
                            isDragActive ? 'border-primary bg-muted/60' : 'border-border bg-muted'
                        }`}>
                        <input {...getInputProps()} />
                        {file ? (
                            <video
                                src={previewUrl ?? undefined}
                                controls
                                className="max-w-full max-h-full rounded-lg shadow-md"
                            />
                        ) : (
                            <div className="text-center">
                                <div className="w-32 h-32 bg-accent rounded-lg flex items-center justify-center mx-auto mb-4">
                                    <UploadIcon />
                                </div>
                                <h3 className="text-xl font-semibold text-foreground/80 mb-2">
                                    {isDragActive ? 'Drop your video here' : 'Drag & drop video or click to upload'}
                                </h3>
                                <p className="text-foreground/60 text-sm">Accepted formats: mp4, mov, webm, avi</p>
                            </div>
                        )}
                    </div>

                    {isUploading && (
                        <div className="mt-4 w-full bg-muted rounded-lg overflow-hidden">
                            <div
                                className="bg-primary h-2 transition-all"
                                style={{ width: `${uploadProgress}%` }}></div>
                            <p className="text-sm text-gray-500 mt-1 text-center">Uploading {uploadProgress}%</p>
                        </div>
                    )}
                </div>

                {/* Right Section: Editor */}
                <div className="w-[30%] bg-sidebar-accent border-l border-border flex flex-col">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-xl font-semibold">Media Editor</h2>
                        <p className="text-sm text-foreground/60">Configure your YouTube video details</p>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex-1 overflow-y-auto p-6 space-y-6 minimal-scrollbar">
                        <div className="space-y-4">
                            <h3 className="font-medium text-sm text-foreground/80">Content</h3>

                            {/* Title */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Title</Label>
                                <Controller
                                    name="title"
                                    control={control}
                                    rules={{ required: 'Title is required' }}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Enter video title..."
                                        />
                                    )}
                                />
                                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title.message}</p>}
                                <p className="text-xs text-foreground/60 mt-1">
                                    {title.length}/{platformLimits.youtube.title}
                                </p>
                            </div>

                            {/* Description */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Description</Label>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field }) => (
                                        <Textarea
                                            {...field}
                                            placeholder="Enter video description..."
                                        />
                                    )}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {description.length}/{platformLimits.youtube.description}
                                </p>
                            </div>

                            {/* Visibility */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Visibility</Label>
                                <Controller
                                    name="visibility"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select visibility" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="public">Public</SelectItem>
                                                <SelectItem value="private">Private</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-muted-foreground bg-sidebar-accent flex flex-col gap-3">
                            <Button
                                type="submit"
                                disabled={isUploading}
                                className="w-full">
                                {isUploading ? 'Uploading...' : 'Upload Video'}
                            </Button>

                            <Button
                                variant="outline"
                                type="button"
                                className="w-full">
                                <LibraryIcon />
                                Select from App Library
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
