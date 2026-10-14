const express = require("express");
const router = express.Router();
const pool = require("../db").pool;

type Request = import("express").Request;
type Response = import("express").Response;

router.get("/", async (req: Request, res: Response) => {
  try {
    const rawQuery = req.query.q;

    if (rawQuery !== undefined && typeof rawQuery !== "string") {
      return res.status(400).json({ error: "Search query must be a single string." });
    }

    const query = rawQuery?.trim();
    const result = query
      ? await pool.query(
          `
          SELECT * FROM professionals
          WHERE name ILIKE $1
             OR trade ILIKE $1
             OR company ILIKE $1
             OR location ILIKE $1
          ORDER BY name ASC
          `,
          [`%${query}%`]
        )
      : await pool.query("SELECT * FROM professionals ORDER BY name ASC", []);

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching professionals:", error);

    res.status(500).json({
      error: "Failed to fetch professionals.",
    });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const {id} = req.params;

    const result = await pool.query("SELECT * FROM professionals WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Professional not found." });
    }
    res.json(result.rows[0]);
  }
  catch (error) {
    console.error("Error fetching professional by trade:", error);
    res.status(500).json({ error: "Failed to fetch professional." });
  }
});

router.get("/trade/:trade", async (req: Request, res: Response) => {
  try {
    const {trade} = req.params;
    const result = await pool.query("SELECT * FROM professionals WHERE trade = $1", [trade]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching professionals by trade:", error);
    res.status(500).json({ error: "Failed to fetch professionals." });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      name,
      phone,
      email,
      trade,
      company,
      location,
      notes,
    } = req.body as {
      name?: string;
      phone?: string;
      email?: string;
      trade?: string;
      company?: string;
      location?: string;
      notes?: string;
    };

    if (!name || !trade) {
      return res.status(400).json({
        error: "Name and trade are required.",
      });
    }

    const result = await pool.query(
      `
      INSERT INTO professionals
        (name, phone, email, trade, company, location, notes)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
      `,
      [name, phone, email, trade, company, location, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating professional:", error);

    res.status(500).json({
      error: "Failed to create professional.",
    });
  }
});

module.exports = router;