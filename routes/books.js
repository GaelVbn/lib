const express = require("express");
const { db } = require("../db");
const router = express.Router();

// Ajouter un livre et son édition
router.post("/", async (req, res) => {
  try {
    const {
      title,
      genre,
      author_first_name,
      author_last_name,
      coffee_shop_name,
      coffee_shop_address,
      publication_year,
      isbn,
      format,
    } = req.body;

    if (
      !title ||
      !author_first_name ||
      !author_last_name ||
      !coffee_shop_name ||
      !coffee_shop_address ||
      !format
    ) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    // Vérifier / créer auteur
    let [authors] = await db.query(
      "SELECT id FROM Author WHERE first_name = ? AND last_name = ?",
      [author_first_name, author_last_name]
    );
    let authorId;
    if (authors.length > 0) authorId = authors[0].id;
    else {
      const [authorResult] = await db.query(
        "INSERT INTO Author (first_name, last_name) VALUES (?, ?)",
        [author_first_name, author_last_name]
      );
      authorId = authorResult.insertId;
    }

    // Vérifier / créer coffee shop
    let [shops] = await db.query("SELECT id FROM CoffeeShop WHERE name = ?", [
      coffee_shop_name,
    ]);
    let shopId;
    if (shops.length > 0) shopId = shops[0].id;
    else {
      const [shopResult] = await db.query(
        "INSERT INTO CoffeeShop (name, address) VALUES (?, ?)",
        [coffee_shop_name, coffee_shop_address]
      );
      shopId = shopResult.insertId;
    }

    // Créer le livre
    const [bookResult] = await db.query(
      "INSERT INTO Book (title, genre, author_id) VALUES (?, ?, ?)",
      [title, genre || null, authorId]
    );
    const bookId = bookResult.insertId;

    // Créer l'édition
    const [editionResult] = await db.query(
      "INSERT INTO Edition (book_id, coffee_shop_id, publication_year, isbn, format, available) VALUES (?,?,?,?,?,TRUE)",
      [bookId, shopId, publication_year || null, isbn || null, format]
    );

    res.json({
      message: "Livre et édition ajoutés avec succès",
      bookId,
      editionId: editionResult.insertId,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout du livre et édition" });
  }
});

// Lister tous les livres avec toutes leurs éditions
router.get("/", async (req, res) => {
  try {
    const [books] = await db.query(`
        SELECT 
          b.id AS book_id, 
          b.title, 
          b.genre,
          a.first_name AS author_first_name, 
          a.last_name AS author_last_name,
          e.id AS edition_id, 
          e.publication_year, 
          e.isbn, 
          e.format, 
          e.available,
          c.name AS coffee_shop_name, 
          c.address AS coffee_shop_address
        FROM Book b
        JOIN Author a ON b.author_id = a.id
        JOIN Edition e ON e.book_id = b.id
        JOIN CoffeeShop c ON e.coffee_shop_id = c.id
        ORDER BY b.id DESC
      `);

    res.json(books);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des livres" });
  }
});

// Supprimer un livre et toutes ses éditions
router.delete("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;

    // Vérifier si le livre existe
    const [books] = await db.query("SELECT * FROM Book WHERE id = ?", [bookId]);
    if (books.length === 0) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Supprimer les éditions associées
    await db.query("DELETE FROM Edition WHERE book_id = ?", [bookId]);

    // Supprimer le livre
    await db.query("DELETE FROM Book WHERE id = ?", [bookId]);

    res.json({ message: "Livre et ses éditions supprimés avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la suppression du livre" });
  }
});

// edit a book with       title, genre,author_first_name,author_last_name,coffee_shop_name,coffee_shop_address,publication_year,isbn,format
router.put("/:id", async (req, res) => {
  try {
    const bookId = req.params.id;
    const {
      title,
      genre,
      author_first_name,
      author_last_name,
      coffee_shop_name,
      coffee_shop_address,
      publication_year,
      isbn,
      format,
    } = req.body;

    if (
      !title ||
      !author_first_name ||
      !author_last_name ||
      !coffee_shop_name ||
      !coffee_shop_address ||
      !format
    ) {
      return res.status(400).json({ message: "Champs manquants" });
    }

    // Vérifier si le livre existe
    const [books] = await db.query("SELECT * FROM Book WHERE id = ?", [bookId]);
    if (books.length === 0) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    // Vérifier / créer auteur
    let [authors] = await db.query(
      "SELECT id FROM Author WHERE first_name = ? AND last_name = ?",
      [author_first_name, author_last_name]
    );
    let authorId;
    if (authors.length > 0) authorId = authors[0].id;
    else {
      const [authorResult] = await db.query(
        "INSERT INTO Author (first_name, last_name) VALUES (?, ?)",
        [author_first_name, author_last_name]
      );
      authorId = authorResult.insertId;
    }

    // Vérifier / créer coffee shop
    let [shops] = await db.query("SELECT id FROM CoffeeShop WHERE name = ?", [
      coffee_shop_name,
    ]);
    let shopId;
    if (shops.length > 0) shopId = shops[0].id;
    else {
      const [shopResult] = await db.query(
        "INSERT INTO CoffeeShop (name, address) VALUES (?, ?)",
        [coffee_shop_name, coffee_shop_address]
      );
      shopId = shopResult.insertId;
    }

    // Mettre à jour le livre
    await db.query(
      "UPDATE Book SET title = ?, genre = ?, author_id = ? WHERE id = ?",
      [title, genre || null, authorId, bookId]
    );

    // Mettre à jour toutes les éditions associées
    await db.query(
      `UPDATE Edition 
       SET coffee_shop_id
  = ?, publication_year = ?, isbn = ?, format = ? 
        WHERE book_id = ?`,
      [shopId, publication_year || null, isbn || null, format, bookId]
    );
    res.json({ message: "Livre et ses éditions mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur lors de la mise à jour du livre" });
  }
});

module.exports = router;
