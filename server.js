const express = require("express");
const fs = require("fs");
const path = require("path");
const geoip = require("geoip-lite");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const FILE = path.join(__dirname, "ips.json");
const ADMIN_PASS = "171";

if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf8");

const readDB = () => JSON.parse(fs.readFileSync(FILE, "utf8") || "[]");
const writeDB = d => fs.writeFileSync(FILE, JSON.stringify(d, null, 2), "utf8");

function getIP(req) {
  let ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket.remoteAddress;
  return ip && ip.startsWith("::ffff:") ? ip.replace("::ffff:", "") : ip;
}

app.post("/consent", (req, res) => {
  if (req.body?.ok !== true) return res.json({ ok: false });

  const ip = getIP(req);
  const geo = geoip.lookup(ip) || {};
  const ua = req.headers["user-agent"] || "";
  const device = /mobile|android|iphone/i.test(ua) ? "Mobile" : "Desktop";

  const db = readDB();
  db.push({
    id: Date.now(),
    ip,
    owner: "Desconhecido",
    country: geo.country || "??",
    city: geo.city || "-",
    device,
    at: new Date().toLocaleString()
  });
  writeDB(db);
  res.json({ ok: true });
});

app.post("/admin/login", (req, res) => {
  res.json({ ok: req.body?.pass === ADMIN_PASS });
});

app.get("/admin/ips", (req, res) => {
  res.json(readDB());
});

app.post("/admin/rename", (req, res) => {
  const { id, name } = req.body;
  const db = readDB();
  const item = db.find(x => x.id === id);
  if (item) {
    item.owner = name;
    writeDB(db);
  }
  res.json({ ok: true });
});

app.post("/admin/delete", (req, res) => {
  const { id } = req.body;
  writeDB(readDB().filter(x => x.id !== id));
  res.json({ ok: true });
});

// 🔥 PORTA AUTOMÁTICA (Render / local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
const express = require("express");
const fs = require("fs");
const path = require("path");
const geoip = require("geoip-lite");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const FILE = path.join(__dirname, "ips.json");
const ADMIN_PASS = "171";

if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, "[]", "utf8");

const readDB = () => JSON.parse(fs.readFileSync(FILE, "utf8") || "[]");
const writeDB = d => fs.writeFileSync(FILE, JSON.stringify(d, null, 2), "utf8");

function getIP(req) {
  let ip =
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket.remoteAddress;
  return ip && ip.startsWith("::ffff:") ? ip.replace("::ffff:", "") : ip;
}

app.post("/consent", (req, res) => {
  if (req.body?.ok !== true) return res.json({ ok: false });

  const ip = getIP(req);
  const geo = geoip.lookup(ip) || {};
  const ua = req.headers["user-agent"] || "";
  const device = /mobile|android|iphone/i.test(ua) ? "Mobile" : "Desktop";

  const db = readDB();
  db.push({
    id: Date.now(),
    ip,
    owner: "Desconhecido",
    country: geo.country || "??",
    city: geo.city || "-",
    device,
    at: new Date().toLocaleString()
  });
  writeDB(db);
  res.json({ ok: true });
});

app.post("/admin/login", (req, res) => {
  res.json({ ok: req.body?.pass === ADMIN_PASS });
});

app.get("/admin/ips", (req, res) => {
  res.json(readDB());
});

app.post("/admin/rename", (req, res) => {
  const { id, name } = req.body;
  const db = readDB();
  const item = db.find(x => x.id === id);
  if (item) {
    item.owner = name;
    writeDB(db);
  }
  res.json({ ok: true });
});

app.post("/admin/delete", (req, res) => {
  const { id } = req.body;
  writeDB(readDB().filter(x => x.id !== id));
  res.json({ ok: true });
});

// 🔥 PORTA AUTOMÁTICA (Render / local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});
