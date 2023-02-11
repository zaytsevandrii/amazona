import React from "react"
import Spinner from 'react-bootstrap/Spinner'

const LoadinBox = () => {
    return (
        <div>
            <Spinner>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    )
}

export default LoadinBox
