import express from "express"
import data from "./data.js"
import mongoose from "mongoose"
import dotenv from "dotenv"
import seedRouter from "./routes/seedRoutes.js"
import userRouter from "./routes/userRoutes.js"
import productRouter from "./routes/productRoutes.js"

dotenv.config()
mongoose.set('strictQuery', true)
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("connected to DB")
    })
    .catch((err) => console.log(err.message))

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/seed',seedRouter)
app.use('/api/products',productRouter)
app.use('/api/users', userRouter);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});


/* app.get("/api/products", (req, res) => {
    res.send(data.products)
}) */
app.get("/api/products/slug/:slug", (req, res) => {
    const product = data.products.find((product) => product.slug === req.params.slug)
    if (product) {
        res.send(product)
    } else {
        res.status(404).send({ message: "Product Not Found" })
    }
})
app.get("/api/products/:id", (req, res) => {
    const product = data.products.find((product) => product._id === req.params.id)
    if (product) {
        res.send(product)
    } else {
        res.status(404).send({ message: "Product Not Found" })
    }
})

const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log(`server at htttp://localhost:${port}`)
})
