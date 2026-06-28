const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")



const app = express()

/**
 * - CORS so the React frontend (different origin) can call the API.
 * - credentials:true allows the auth cookie to be sent/received.
 * - Origin is read from FRONTEND_URL env, falling back to the Vite dev server.
 */
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(cookieParser())

/**
 * - Routes required
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")

/**
 * - Use Routes
 */

app.get("/", (req, res) => {
    res.send("Ledger Service is up and running")
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

module.exports = app