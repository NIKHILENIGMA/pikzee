/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Badge } from '@/components/ui/badge'

const HeartIcon = () => (
    <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z"></path>
    </svg>
)

const MessageCircleIcon = () => (
    <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
)

const ShareIcon = () => (
    <svg
        className="h-6 w-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <circle
            cx="18"
            cy="5"
            r="3"></circle>
        <circle
            cx="6"
            cy="12"
            r="3"></circle>
        <circle
            cx="18"
            cy="19"
            r="3"></circle>
        <line
            x1="8.59"
            y1="13.51"
            x2="15.42"
            y2="17.49"></line>
        <line
            x1="15.41"
            y1="6.51"
            x2="8.59"
            y2="10.49"></line>
    </svg>
)

const MoreHorizontalIcon = () => (
    <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <circle
            cx="12"
            cy="12"
            r="1"></circle>
        <circle
            cx="19"
            cy="12"
            r="1"></circle>
        <circle
            cx="5"
            cy="12"
            r="1"></circle>
    </svg>
)

const Repeat2Icon = () => (
    <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <polyline points="2,9 9,9 9,2"></polyline>
        <path d="m9 9 5 5-5 5"></path>
        <path d="m22 15-5-5 5-5"></path>
        <polyline points="22,15 15,15 15,22"></polyline>
    </svg>
)

const ThumbsUpIcon = () => (
    <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path d="M7 10v12l4-4 5 4V10l-4.5-4.5L7 10z"></path>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
    </svg>
)

const MessageSquareIcon = () => (
    <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
)

interface PlatformPreviewProps {
    platform: 'youtube' | 'instagram' | 'twitter' | 'linkedin'
    title: string
    description: string
    mediaUrl?: string
    options: any
}

export function PlatformPreview({ platform, title, description, mediaUrl, options }: PlatformPreviewProps) {
    const renderYouTubePreview = () => (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
            {mediaUrl ? (
                <div className="relative bg-black aspect-video group cursor-pointer">
                    {mediaUrl.includes('video') ? (
                        <video
                            src={mediaUrl}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img
                            src={mediaUrl || '/placeholder.svg?height=360&width=640&query=youtube video thumbnail'}
                            alt="Thumbnail"
                            className="w-full h-full object-cover"
                        />
                    )}
                    {/* YouTube play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-red-600 rounded-full p-4 group-hover:bg-red-700 transition-colors">
                            <svg
                                className="w-8 h-8 text-white ml-1"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded font-medium">
                        {mediaUrl.includes('video') ? '10:24' : '0:00'}
                    </div>
                    {options?.visibility === 'private' && (
                        <div className="absolute top-2 left-2">
                            <Badge
                                variant="secondary"
                                className="bg-black/80 text-white border-0">
                                🔒 Private
                            </Badge>
                        </div>
                    )}
                </div>
            ) : (
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <div className="w-16 h-16 mx-auto mb-3 bg-red-100 rounded-full flex items-center justify-center">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                        <p className="text-sm font-medium">Upload video or image</p>
                    </div>
                </div>
            )}
            <div className="p-4">
                <div className="flex gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        YC
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base text-gray-900 line-clamp-2 leading-tight">
                            {title || 'Your amazing video title will appear here'}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-sm text-gray-600">
                            <span className="font-medium">Your Channel</span>
                            <span>•</span>
                            <span>1.2K views</span>
                            <span>•</span>
                            <span>2 hours ago</span>
                        </div>
                    </div>
                    <MoreHorizontalIcon />
                </div>
                {description && <p className="text-sm text-gray-700 mt-3 line-clamp-3 leading-relaxed">{description}</p>}
            </div>
        </div>
    )

    const renderInstagramPreview = () => (
        <div className="bg-white rounded-lg overflow-hidden border border-gray-200 max-w-sm mx-auto shadow-sm">
            <div className="flex items-center gap-3 p-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-full p-0.5">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-gray-800">IG</span>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-sm text-gray-900">your_username</p>
                    <p className="text-xs text-gray-500">Sponsored</p>
                </div>
                <MoreHorizontalIcon />
            </div>

            {mediaUrl ? (
                <div className="aspect-square bg-gray-100 relative">
                    <img
                        src={mediaUrl || '/placeholder.svg?height=400&width=400&query=instagram post image'}
                        alt="Post"
                        className="w-full h-full object-cover"
                    />
                    {options?.carousel && (
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">1/3</div>
                    )}
                </div>
            ) : (
                <div className="aspect-square bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                        <div className="w-12 h-12 mx-auto mb-2 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24">
                                <rect
                                    x="3"
                                    y="3"
                                    width="18"
                                    height="18"
                                    rx="2"
                                    ry="2"></rect>
                                <circle
                                    cx="9"
                                    cy="9"
                                    r="2"></circle>
                                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                        </div>
                        <p className="text-xs font-medium">Add photo</p>
                    </div>
                </div>
            )}

            <div className="p-3">
                <div className="flex gap-4 mb-3">
                    <HeartIcon />
                    <MessageCircleIcon />
                    <ShareIcon />
                    <div className="ml-auto">
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5Z"></path>
                        </svg>
                    </div>
                </div>
                <p className="text-xs text-gray-900 font-semibold mb-1">1,234 likes</p>
                <p className="text-sm text-gray-900">
                    <span className="font-semibold">your_username</span>{' '}
                    {description || 'Your amazing caption will appear here... ✨ #instagram #post'}
                </p>
                <p className="text-xs text-gray-500 mt-2">View all 23 comments</p>
                <p className="text-xs text-gray-400 mt-1">2 HOURS AGO</p>
            </div>
        </div>
    )

    const renderTwitterPreview = () => (
        <div className="bg-white rounded-2xl border border-gray-200 p-4 max-w-lg mx-auto shadow-sm hover:bg-gray-50/50 transition-colors">
            <div className="flex gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    X
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-sm text-gray-900">Your Name</p>
                        <svg
                            className="w-4 h-4 text-blue-500"
                            fill="currentColor"
                            viewBox="0 0 24 24">
                            <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                        </svg>
                        <p className="text-gray-500 text-sm">@yourusername</p>
                        <span className="text-gray-500">·</span>
                        <p className="text-gray-500 text-sm">2h</p>
                    </div>

                    <p className="text-sm mt-2 text-gray-900 leading-relaxed">
                        {description || 'Your tweet will appear here... 🚀 #excited #newpost'}
                    </p>

                    {options?.thread && (
                        <div className="mt-2">
                            <p className="text-blue-500 text-sm hover:underline cursor-pointer">Show this thread</p>
                        </div>
                    )}

                    {mediaUrl && (
                        <div className="mt-3 rounded-2xl overflow-hidden border border-gray-200">
                            <img
                                src={mediaUrl || '/placeholder.svg?height=300&width=500&query=twitter post image'}
                                alt="Tweet media"
                                className="w-full max-h-64 object-cover"
                            />
                        </div>
                    )}

                    <div className="flex justify-between max-w-md mt-3 text-gray-500">
                        <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer group">
                            <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                                <MessageCircleIcon />
                            </div>
                            <span className="text-sm">24</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer group">
                            <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                                <Repeat2Icon />
                            </div>
                            <span className="text-sm">12</span>
                        </div>
                        <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer group">
                            <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                                <HeartIcon />
                            </div>
                            <span className="text-sm">89</span>
                        </div>
                        <div className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors">
                            <ShareIcon />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    const renderLinkedInPreview = () => (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden max-w-lg mx-auto shadow-sm">
            <div className="p-4">
                <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        LI
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm text-gray-900">Your Name</p>
                            <span className="text-blue-600">• 1st</span>
                        </div>
                        <p className="text-xs text-gray-600 leading-tight">Your Professional Title at Company Name</p>
                        <div className="flex items-center gap-1 mt-1">
                            <p className="text-xs text-gray-500">2h</p>
                            <span className="text-xs text-gray-500">•</span>
                            <svg
                                className="w-3 h-3 text-gray-500"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                        </div>
                    </div>
                    <MoreHorizontalIcon />
                </div>

                <p className="text-sm mt-3 text-gray-900 leading-relaxed">
                    {description || 'Excited to share this professional update with my network! 💼 #professional #linkedin'}
                </p>

                {options?.postType === 'document' && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                        <div className="flex items-center gap-2">
                            <svg
                                className="w-5 h-5 text-red-600"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            <span className="text-sm font-medium text-gray-900">Document.pdf</span>
                        </div>
                    </div>
                )}
            </div>

            {mediaUrl && (
                <div className="bg-gray-100">
                    <img
                        src={mediaUrl || '/placeholder.svg?height=300&width=500&query=linkedin professional post image'}
                        alt="LinkedIn post"
                        className="w-full max-h-64 object-cover"
                    />
                </div>
            )}

            <div className="px-4 py-2 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                    <span>👍 ❤️ 💡 42 reactions</span>
                    <span>8 comments • 3 reposts</span>
                </div>
            </div>

            <div className="px-4 pb-4 border-t border-gray-100">
                <div className="flex justify-between">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex-1">
                        <ThumbsUpIcon />
                        <span className="text-sm font-medium text-gray-700">Like</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex-1">
                        <MessageSquareIcon />
                        <span className="text-sm font-medium text-gray-700">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex-1">
                        <Repeat2Icon />
                        <span className="text-sm font-medium text-gray-700">Repost</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors flex-1">
                        <ShareIcon />
                        <span className="text-sm font-medium text-gray-700">Send</span>
                    </button>
                </div>
            </div>
        </div>
    )

    const previews = {
        youtube: renderYouTubePreview,
        instagram: renderInstagramPreview,
        twitter: renderTwitterPreview,
        linkedin: renderLinkedInPreview
    }

    return <div className="space-y-4">{previews[platform]()}</div>
}
