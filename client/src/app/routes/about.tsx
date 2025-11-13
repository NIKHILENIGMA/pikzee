import { type FC } from 'react'

const About: FC = () => {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-background text-secondary-foreground px-4 py-12 sm:px-6 lg:px-8">
            <section className="w-full max-w-2xl  rounded-lg shadow-md p-8">
                <h1 className="text-3xl font-bold  mb-4 text-center">About Us</h1>
                <p className=" text-base sm:text-lg mb-6 text-center">
                    Welcome to our content app! Our mission is to provide high-quality, engaging content for everyone. We believe in accessibility,
                    creativity, and community.
                </p>
                <ul className="list-disc list-inside  space-y-2">
                    <li>Responsive design for all devices</li>
                    <li>Easy navigation and user-friendly interface</li>
                    <li>Regularly updated with fresh content</li>
                </ul>
            </section>
        </main>
    )
}

export default About
