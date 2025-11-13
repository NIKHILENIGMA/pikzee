'use client'

import { AlertCircle } from 'lucide-react'

interface DisconnectModalProps {
    isOpen: boolean
    platform?: string
    onConfirm: () => void
    onCancel: () => void
}

export default function DisconnectModal({ isOpen, platform, onConfirm, onCancel }: DisconnectModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl max-w-sm w-full p-8 border border-slate-700/50 shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Icon and title */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 rounded-full bg-red-500/20 border border-red-500/50">
                        <AlertCircle
                            size={24}
                            className="text-red-400"
                        />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Disconnect {platform}?</h2>
                        <p className="text-slate-400 text-sm">This action cannot be undone</p>
                    </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 mb-8 leading-relaxed">
                    This will revoke access to your {platform} account. You can reconnect anytime by clicking the connect button again.
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-3 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700/50 hover:border-slate-500 transition-all duration-300 font-semibold hover:scale-105 active:scale-95">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-3 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white transition-all duration-300 font-semibold shadow-lg hover:shadow-red-900/50 hover:scale-105 active:scale-95">
                        Disconnect
                    </button>
                </div>
            </div>
        </div>
    )
}
