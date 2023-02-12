import axios from "axios"
import React, { useContext, useEffect, useReducer } from "react"
import Col from "react-bootstrap/esm/Col"
import Row from "react-bootstrap/esm/Row"
import { useNavigate, useParams } from "react-router-dom"
import ListGroup from "react-bootstrap/ListGroup"
import Rating from "../components/Rating"
import Card from "react-bootstrap/Card"
import Badge from "react-bootstrap/Badge"
import Button from "react-bootstrap/Button"
import { Helmet } from "react-helmet-async"
import MessageBox from "../components/MessageBox"
import { getError } from "../utils"
import { Store } from "../Store"

const reducer = (state, action) => {
    switch (action.type) {
        case "FETCH_REQUEST":
            return { ...state, loading: true }
        case "FETCH_SUCCESS":
            return { ...state, loading: false, product: action.payload }
        case "FETCH_FAIL":
            return { ...state, loading: false, error: action.payload }
        default:
            return state
    }
}

const ProductScreen = () => {
    const navigate = useNavigate()
    const params = useParams()
    const { slug } = params

    const [{ loading, product, error }, dispatch] = useReducer(reducer, {
        loading: true,
        product: [],
        error: "",
    })
    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: "FETCH_REQUEST" })
            try {
                const result = await axios.get(`/api/products/slug/${slug}`)
                dispatch({ type: "FETCH_SUCCESS", payload: result.data })
            } catch (error) {
                dispatch({ type: "FETCH_FAIL", payload: getError(error) })
            }
        }
        fetchData()
    }, [slug])

    const { state, dispatch: ctxDispatch } = useContext(Store)
    const { cart } = state
    const addToCartHandler = async () => {
        const existItem = cart.cartItems.find((el) => el._id === product._id)
        const quantity = existItem ? existItem.quantity + 1 : 1
        const { data } = await axios.get(`/api/products/${product._id}`)
        if (data.countInStock < quantity) {
            window.alert("Sorry, product is out of stock")
            return
        }
        ctxDispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity},
    })
    navigate('/cart')
    }

    return loading ? (
        <div>Loading...</div>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div>
            <Row>
                <Col md={6}>
                    <img className="img-large" src={product.image} alt={product.name} />
                </Col>
                <Col md={3}>
                    <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Helmet>
                                <title>{product.name}</title>
                            </Helmet>
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Rating rating={product.rating} numReviews={product.numReviews}></Rating>
                        </ListGroup.Item>
                        <ListGroup.Item>Price: ${product.price}</ListGroup.Item>
                        <ListGroup.Item>
                            Description: <p>{product.description}</p>
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={3}>
                    <Card className="mt-2">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>${product.price}</Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ? (
                                                <Badge bg="success">In Stock</Badge>
                                            ) : (
                                                <Badge bg="danger">Unavailable</Badge>
                                            )}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <div className="d-grid">
                                            <Button onClick={addToCartHandler} variant="primary">
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ProductScreen
