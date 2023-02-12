import React from "react"
import Spinner from 'react-bootstrap/Spinner'

const LoadinBox = () => {
    return (
            <Spinner>
                <span className="visually-hidden">Loading...</span>
            </Spinner>
    )
}

export default LoadinBox
