import { type FC } from 'react'

const AuthLogo: FC = () => {
    return (
        <div className="absolute top-6 left-6">
            <img
                src="../../../dummylogo.jpg"
                alt="logo"
                className="h-6 w-6 rounded"
            />
        </div>
    )
}

export default AuthLogo
