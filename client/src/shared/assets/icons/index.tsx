import { Mail } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'

export const UploadIcon = () => (
    <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
    </svg>
)

export const VideoIcon = () => (
    <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <polygon points="23 7 16 12 23 17 23 7"></polygon>
        <rect
            x="1"
            y="5"
            width="15"
            height="14"
            rx="2"
            ry="2"></rect>
    </svg>
)

export const ImageIcon = () => (
    <svg
        className="h-5 w-5"
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
            cx="8.5"
            cy="8.5"
            r="1.5"></circle>
        <polyline points="21,15 16,10 5,21"></polyline>
    </svg>
)

export const TwitterIcon = () => (
    <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
    </svg>
)

export const LinkedInIcon = () => (
    <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path>
        <rect
            x="2"
            y="9"
            width="4"
            height="12"></rect>
        <circle
            cx="4"
            cy="4"
            r="2"></circle>
    </svg>
)

export const LibraryIcon = () => (
    <svg
        className="h-4 w-4"
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
        <rect
            x="7"
            y="7"
            width="3"
            height="3"></rect>
        <rect
            x="14"
            y="7"
            width="3"
            height="3"></rect>
        <rect
            x="7"
            y="14"
            width="10"
            height="3"></rect>
    </svg>
)

export { Mail, FcGoogle, FaGithub }
