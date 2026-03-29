import { Router, type IRouter } from "express";
import { db, complaintsTable, statusHistoryTable, usersTable, schemesTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { classifyComplaint, recommendSchemeCategories } from "../lib/classifier.js";

const router: IRouter = Router();

function requireAuth(req: any, res: any, next: any) {
  if (!(req.session as any).userId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required" });
    return;
  }
  next();
}

router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (!user) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "User not found" });
      return;
    }

    const conditions: any[] = [];
    if (user.role !== "ADMIN") {
      conditions.push(eq(complaintsTable.userId, userId));
    }

    const { status, category } = req.query as Record<string, string>;
    if (status) conditions.push(eq(complaintsTable.status, status as any));
    if (category) conditions.push(eq(complaintsTable.category, category as any));

    const complaints = await db
      .select({
        id: complaintsTable.id,
        title: complaintsTable.title,
        description: complaintsTable.description,
        category: complaintsTable.category,
        priority: complaintsTable.priority,
        department: complaintsTable.department,
        status: complaintsTable.status,
        userId: complaintsTable.userId,
        userName: usersTable.name,
        createdAt: complaintsTable.createdAt,
        updatedAt: complaintsTable.updatedAt,
      })
      .from(complaintsTable)
      .leftJoin(usersTable, eq(complaintsTable.userId, usersTable.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(complaintsTable.createdAt));

    res.json(complaints);
  } catch (err) {
    req.log.error({ err }, "List complaints error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    const { title, description } = req.body;

    if (!title || !description) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "Title and description are required" });
      return;
    }

    const classification = classifyComplaint(title, description);

    const [complaint] = await db
      .insert(complaintsTable)
      .values({
        title,
        description,
        category: classification.category,
        priority: classification.priority,
        department: classification.department,
        status: "SUBMITTED",
        userId,
      })
      .returning();

    await db.insert(statusHistoryTable).values({
      complaintId: complaint.id,
      status: "SUBMITTED",
      note: "Complaint submitted and auto-classified",
    });

    const [user] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    res.status(201).json({ ...complaint, userName: user?.name });
  } catch (err) {
    req.log.error({ err }, "Submit complaint error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    const id = parseInt(req.params.id);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    const [complaint] = await db
      .select({
        id: complaintsTable.id,
        title: complaintsTable.title,
        description: complaintsTable.description,
        category: complaintsTable.category,
        priority: complaintsTable.priority,
        department: complaintsTable.department,
        status: complaintsTable.status,
        userId: complaintsTable.userId,
        userName: usersTable.name,
        createdAt: complaintsTable.createdAt,
        updatedAt: complaintsTable.updatedAt,
      })
      .from(complaintsTable)
      .leftJoin(usersTable, eq(complaintsTable.userId, usersTable.id))
      .where(eq(complaintsTable.id, id))
      .limit(1);

    if (!complaint) {
      res.status(404).json({ error: "NOT_FOUND", message: "Complaint not found" });
      return;
    }

    if (user?.role !== "ADMIN" && complaint.userId !== userId) {
      res.status(403).json({ error: "FORBIDDEN", message: "Access denied" });
      return;
    }

    const statusHistory = await db
      .select()
      .from(statusHistoryTable)
      .where(eq(statusHistoryTable.complaintId, id))
      .orderBy(statusHistoryTable.changedAt);

    const recommendedCategories = recommendSchemeCategories(complaint.category as any, user?.role ?? "CITIZEN");

    const allSchemes = await db.select().from(schemesTable);
    const recommendedSchemes = allSchemes
      .filter((s) => recommendedCategories.includes(s.category))
      .slice(0, 3)
      .map((s) => ({ ...s, eligibleRoles: JSON.parse(s.eligibleRoles) }));

    res.json({ ...complaint, statusHistory, recommendedSchemes });
  } catch (err) {
    req.log.error({ err }, "Get complaint error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.patch("/:id/status", requireAuth, async (req, res) => {
  try {
    const userId = (req.session as any).userId;
    const id = parseInt(req.params.id);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (user?.role !== "ADMIN") {
      res.status(403).json({ error: "FORBIDDEN", message: "Admin access required" });
      return;
    }

    const { status, note } = req.body;
    if (!status) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "Status is required" });
      return;
    }

    const [complaint] = await db
      .update(complaintsTable)
      .set({ status, updatedAt: new Date() })
      .where(eq(complaintsTable.id, id))
      .returning();

    if (!complaint) {
      res.status(404).json({ error: "NOT_FOUND", message: "Complaint not found" });
      return;
    }

    await db.insert(statusHistoryTable).values({ complaintId: id, status, note });

    const [userRow] = await db.select({ name: usersTable.name }).from(usersTable).where(eq(usersTable.id, complaint.userId)).limit(1);

    res.json({ ...complaint, userName: userRow?.name });
  } catch (err) {
    req.log.error({ err }, "Update complaint status error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;
