// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const mockOpenAIStream = async function* (prompt: string, _signal?: AbortSignal) {
    if (!prompt) {
        yield 'No prompt provided.'
        return
    }

    const responses = [
        'I understand you need help with ',
        'this topic. Let me provide you with ',
        'a comprehensive response that covers ',
        "the key aspects you're looking for.\n\n",
        '## Main Points\n\n',
        '1. **Understanding the core concept**\n',
        '2. **Practical applications**\n',
        '3. **Best practices**\n',
        '4. **Common challenges and solutions**\n',
        '5. **Advanced techniques**\n\n',
        'This approach will give you a solid ',
        'foundation to work with and help you ',
        'achieve your goals effectively.\n\n',
        '---\n\n',
        'Let me elaborate on each point:\n\n',
        '### Understanding the Core Concept\n\n',
        'When it comes to understanding the core concept, ',
        "it's important to start with the fundamentals ",
        'and build your knowledge progressively. ',
        'This ensures you have a strong base to work from.\n\n',
        '### Practical Applications\n\n',
        'For practical applications, consider real-world ',
        "scenarios where you can apply what you've learned. ",
        'This hands-on experience is invaluable for ',
        'reinforcing your understanding.\n\n',
        '### Best Practices\n\n',
        'Regarding best practices, always follow ',
        'established conventions and standards in your field. ',
        'This will help you write cleaner, more maintainable code ',
        'and collaborate effectively with others.\n\n',
        '> **Note:** Remember that continuous learning and practice ',
        "are key to mastering any skill. Don't hesitate ",
        'to experiment and learn from your mistakes.'
    ]

    for (const chunk of responses) {
        await new Promise((resolve) => setTimeout(resolve, 100 + Math.random() * 200))
        yield chunk
    }
}
