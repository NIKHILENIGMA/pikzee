
const emojis = [
    '😀',
    '🚀',
    '🎉',
    '🌟',
    '🔥',
    '💡',
    '📚',
    '🎨',
    '🎵',
    '⚡',
    '🎮',
    '🏆',
    '🌈',
    '✨',
    '🎭',
    '🎪',
    '🍀',
    '🌻',
    '⭐',
    '🎯',
    '🔮',
    '🎁',
    '👑',
    '💎',
    '🌸',
    '🦋',
    '🌙',
    '☀️',
    '🌊',
    '🏔️'
]

export function generateRandomEmoji() {
    return emojis[Math.floor(Math.random() * emojis.length)]
}