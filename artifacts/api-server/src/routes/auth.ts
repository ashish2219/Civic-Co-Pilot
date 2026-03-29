import { Router, type IRouter } from "express";
import { db, usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "civic-copilot-salt").digest("hex");
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "All fields are required" });
      return;
    }

    if (!["STUDENT", "CITIZEN", "ADMIN"].includes(role)) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "Invalid role" });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "Password must be at least 6 characters" });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ error: "EMAIL_EXISTS", message: "Email already registered" });
      return;
    }

    const passwordHash = hashPassword(password);
    const [user] = await db.insert(usersTable).values({ name, email, passwordHash, role }).returning();

    (req.session as any).userId = user.id;

    res.status(201).json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
      message: "Registration successful",
    });
  } catch (err) {
    req.log.error({ err }, "Registration error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "Email and password are required" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (!user || user.passwordHash !== hashPassword(password)) {
      res.status(401).json({ error: "INVALID_CREDENTIALS", message: "Invalid email or password" });
      return;
    }

    (req.session as any).userId = user.id;

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt },
      message: "Login successful",
    });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ message: "Logged out successfully" });
  });
});

router.get("/me", async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    if (!userId) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Not authenticated" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (!user) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "User not found" });
      return;
    }

    res.json({ id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt });
  } catch (err) {
    req.log.error({ err }, "Get current user error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;
