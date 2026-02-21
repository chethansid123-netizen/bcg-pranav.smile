import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("gcbp.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    name TEXT,
    role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER,
    name TEXT,
    phone TEXT,
    email TEXT,
    pan TEXT,
    aadhar TEXT,
    income REAL,
    property_value REAL,
    loan_amount REAL,
    tenure INTEGER,
    status TEXT DEFAULT 'NEW',
    assigned_to INTEGER,
    rm_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    type TEXT,
    url TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS bank_offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bank_name TEXT,
    roi REAL,
    processing_fee REAL,
    max_tenure INTEGER,
    min_income REAL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS commissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER,
    agent_id INTEGER,
    amount REAL,
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)");
  insertUser.run("admin@gcbp.com", "admin123", "System Admin", "ADMIN");
  insertUser.run("sales@gcbp.com", "sales123", "John Sales", "SALES_AGENT");
  insertUser.run("credit@gcbp.com", "credit123", "Sarah Credit", "CREDIT_ANALYST");
  insertUser.run("ops@gcbp.com", "ops123", "Mike Ops", "OPERATIONS");
  insertUser.run("customer@example.com", "cust123", "Alice Customer", "CUSTOMER");

  const insertBank = db.prepare("INSERT INTO bank_offers (bank_name, roi, processing_fee, max_tenure, min_income) VALUES (?, ?, ?, ?, ?)");
  insertBank.run("HDFC Bank", 8.5, 0.5, 30, 25000);
  insertBank.run("ICICI Bank", 8.7, 0.4, 25, 30000);
  insertBank.run("SBI", 8.4, 0.2, 30, 20000);
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // Auth API
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT id, email, name, role FROM users WHERE email = ? AND password = ?").get(email, password) as any;
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  // Leads API
  app.get("/api/leads", (req, res) => {
    const { role, userId } = req.query;
    let leads;
    if (role === 'CUSTOMER') {
      leads = db.prepare("SELECT * FROM leads WHERE customer_id = ? ORDER BY created_at DESC").all(userId);
    } else if (role === 'SALES_AGENT') {
      leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
    } else if (role === 'CREDIT_ANALYST') {
      leads = db.prepare("SELECT * FROM leads WHERE status IN ('IN_REVIEW', 'DOCS_VERIFIED') ORDER BY created_at DESC").all();
    } else {
      leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
    }
    res.json(leads);
  });

  app.post("/api/leads", (req, res) => {
    const { customer_id, name, phone, email, pan, aadhar, income, property_value, loan_amount, tenure } = req.body;
    const result = db.prepare(`
      INSERT INTO leads (customer_id, name, phone, email, pan, aadhar, income, property_value, loan_amount, tenure)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(customer_id, name, phone, email, pan, aadhar, income, property_value, loan_amount, tenure);
    res.json({ id: result.lastInsertRowid });
  });

  app.patch("/api/leads/:id", (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const keys = Object.keys(updates);
    const setClause = keys.map(k => `${k} = ?`).join(", ");
    const values = Object.values(updates);
    db.prepare(`UPDATE leads SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values, id);
    res.json({ success: true });
  });

  // Banks API
  app.get("/api/banks", (req, res) => {
    const banks = db.prepare("SELECT * FROM bank_offers ORDER BY roi ASC").all();
    res.json(banks);
  });

  // Users API (Admin)
  app.get("/api/users", (req, res) => {
    const users = db.prepare("SELECT id, email, name, role FROM users").all();
    res.json(users);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
