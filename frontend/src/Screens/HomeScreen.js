import React, { useEffect, useReducer, useState } from "react"
import axios from "axios"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Product from "../components/Product"
import { Helmet } from "react-helmet-async"
import LoadinBox from "../components/LoadinBox"
import MessageBox from "../components/MessageBox"

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true }
        case "FETCH_SUCCESS":
            return { ...state, loading: false, products: action.payload }
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

const HomeScreen = () => {
    const [{ loading, products, error }, dispatch] = useReducer(reducer, {
        loading: true,
        products: [],
        error: "",
    })
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const result = await axios.get("api/products")
                console.log(result)
                dispatch({ type: "FETCH_SUCCESS", payload: result.data })
            } catch (error) {
                dispatch({ type: "FETCH_FAIL", payload: error.message })
            }
        }
        fetchData()
    }, [])
    return (
        <div>
            <Helmet>
                <title>Amazona</title>
            </Helmet>
            <h1>Featured Products</h1>
            <div className="products">
                {loading ? (
                   <LoadinBox/>
                ) : error ? (
                    <MessageBox variant='danger'>{error}</MessageBox>
                ) : (
                    <Row>
                        {products.map((product) => (
                            <Col key={product.slug} sm={6} md={4} lg={3} className='mb-1'>
                                <Product product={product}/>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    )
}

export default HomeScreen
