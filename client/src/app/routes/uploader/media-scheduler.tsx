import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'
import { toast, Toaster } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { useAccounts } from '@/features/smart-publish/api/get-accounts'
import { useInitiateVideoUpload, usePublishVideo } from '@/features/smart-publish/api/publish-video'
import { useDefaultWorkspace } from '@/features/workspace/api/get-default-workspace'
import { VideoIcon, UploadIcon, LibraryIcon } from '@/shared/assets/icons'
import { useNavigate } from 'react-router'

const platformLimits = {
    YOUTUBE: { title: 100, description: 5000 }
}

type FormValues = {
    title: string
    description: string
    visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED'
    socialAccountId: string
}

export default function MediaScheduler() {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isUploading, setIsUploading] = useState(false)
    const [platform] = useState<'YOUTUBE'>('YOUTUBE')

    const { data: workspaceData } = useDefaultWorkspace({})
    const workspaceId = workspaceData?.data?.id
    const navigate = useNavigate()

    const { data: accounts } = useAccounts({
        workspaceId: workspaceId ?? '',
        queryConfig: { enabled: !!workspaceId }
    })

    const initiateUploadMutation = useInitiateVideoUpload()
    const publishMutation = usePublishVideo()

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
            visibility: 'PUBLIC',
            socialAccountId: ''
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

            if (!workspaceId) {
                setError('Workspace not found.')
                return
            }

            setIsUploading(true)
            setUploadProgress(0)
            setError(null)

            // 1️⃣ Initiate upload process in backend to get S3 Presigned URL
            const { url: uploadUrl, postId } = await initiateUploadMutation.mutateAsync({
                platform,
                data: {
                    workspaceId,
                    socialAccountId: values.socialAccountId,
                    title: values.title,
                    description: values.description,
                    visibility: values.visibility,
                    contentType: file.type
                }
            })

            // 2️⃣ Upload the file directly to S3
            await axios.put(uploadUrl, file, {
                headers: {
                    'Content-Type': file.type
                },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1))
                    setUploadProgress(percent)
                }
            })

            // 3️⃣ Tell backend to publish the video from S3 to the platform
            await publishMutation.mutateAsync({
                postId,
                platform
            })

            toast.success('✅ Video upload initiated! It will be published shortly.')
            setFile(null)
            setUploadProgress(0)
            navigate('media-manager')
        } catch (err: any) {
            setError(err?.response?.data?.message || err.message || 'Upload failed.')
            toast.error(err.message || 'Upload failed.')
        } finally {
            setIsUploading(false)
        }
    }

    const title = watch('title') || ''
    const description = watch('description') || ''

    return (
        <div className="min-h-screen bg-background text-foreground">
            <div className="flex h-screen">
                {/* Left Section: Preview */}
                <div className="w-[70%] p-6 flex flex-col">
                    {error && <p className="w-full text-red-500 text-sm mt-3 text-center">{error}</p>}
                    <div className="mb-6">
                        <Tabs value={platform}>
                            <TabsList className="grid w-full grid-cols-1 h-12">
                                <TabsTrigger
                                    value="YOUTUBE"
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

                            {/* Account Selection */}
                            <div>
                                <Label className="text-sm font-medium mb-2 block">Channel</Label>
                                <Controller
                                    name="socialAccountId"
                                    control={control}
                                    rules={{ required: 'Please select a channel' }}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a channel" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {accounts?.filter(acc => acc.platform === platform).map((account) => (
                                                    <SelectItem key={account.id} value={account.id}>
                                                        {account.accountName}
                                                    </SelectItem>
                                                ))}
                                                {!accounts?.length && (
                                                    <SelectItem value="none" disabled>No channels connected</SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                {errors.socialAccountId && <p className="text-xs text-red-500 mt-1">{errors.socialAccountId.message}</p>}
                            </div>

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
                                    {title.length}/{platformLimits[platform].title}
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
                                    {description.length}/{platformLimits[platform].description}
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
                                                <SelectItem value="PUBLIC">Public</SelectItem>
                                                <SelectItem value="PRIVATE">Private</SelectItem>
                                                <SelectItem value="UNLISTED">Unlisted</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-muted-foreground bg-sidebar-accent flex flex-col gap-3">
                            <Button
                                type="submit"
                                disabled={isUploading || !workspaceId}
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
            <Toaster />
        </div>
    )
}
