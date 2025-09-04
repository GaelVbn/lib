const express = require("express");
const cors = require("cors");
const booksRouter = require("./routes/books");
const clientsRouter = require("./routes/clients");
const coffeeShopsRouter = require("./routes/coffeeShops");
const loansRouter = require("./routes/loans");

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/books", booksRouter);
app.use("/clients", clientsRouter);
app.use("/coffeeShops", coffeeShopsRouter);
app.use("/loans", loansRouter);

app.listen(3005, () => console.log("Server running on port 3005"));
