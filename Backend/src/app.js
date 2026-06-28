const express = require("express")
const cookieParser = require("cookie-parser")
const cors = require("cors")



const app = express()

/**
 * - CORS so the React frontend (different origin) can call the API.
 * - credentials:true allows the auth cookie to be sent/received.
 * - FRONTEND_URL can hold one OR several comma-separated origins, e.g.
 *   "http://localhost:5173,https://finledger-bank.netlify.app"
 */
const allowedOrigins = (
    process.env.FRONTEND_URL ||
    "https://finledger-bank.netlify.app,http://localhost:5173"
)
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean)

app.use(cors({
    origin: function (origin, callback) {
        // Allow non-browser tools (no Origin header) and any whitelisted origin.
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true)
        }
        return callback(new Error("Not allowed by CORS"))
    },
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