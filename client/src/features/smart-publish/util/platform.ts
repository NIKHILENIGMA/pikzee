import type React from 'react'
import { FaLinkedin, FaYoutube } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'

interface PlatformConfig {
    icon: React.ElementType
    color: string
    gradient: string
}

export const PLATFORM_CONFIG: Record<string, PlatformConfig> = {
    youtube: { icon: FaYoutube, color: '#FF0000', gradient: 'from-[#FF0033] via-[#FF4754] to-[#FFFFFF]' },
    linkedin: { icon: FaLinkedin, color: '#0077B5', gradient: 'from-[#0077B5] to-[#fff]' },
    twitter: { icon: FaXTwitter, color: '#000000', gradient: 'from-[#000000] to-[#fff]' }
}

export const SUPPORTED_PLATFORMS = ['YOUTUBE', 'LINKEDIN', 'TWITTER'];