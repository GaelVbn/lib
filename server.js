const express = require("express");
const booksRouter = require("./routes/books");
const clientsRouter = require("./routes/clients");
const coffeeShopsRouter = require("./routes/coffeeShops");
const loansRouter = require("./routes/loans");

const app = express();
app.use(express.json());

// Routes
app.use("/books", booksRouter);
app.use("/clients", clientsRouter);
app.use("/coffeeShops", coffeeShopsRouter);
app.use("/loans", loansRouter);

app.listen(3000, () => console.log("Server running on port 3000"));
