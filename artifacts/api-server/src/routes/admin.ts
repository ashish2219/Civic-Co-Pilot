import { Router, type IRouter } from "express";
import { db, complaintsTable, usersTable } from "@workspace/db";
import { eq, and, desc, count, sql } from "drizzle-orm";

const router: IRouter = Router();

async function requireAdmin(req: any, res: any, next: any) {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    res.status(401).json({ error: "UNAUTHORIZED", message: "Authentication required" });
    return;
  }
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);
  if (!user || user.role !== "ADMIN") {
    res.status(403).json({ error: "FORBIDDEN", message: "Admin access required" });
    return;
  }
  next();
}

router.get("/complaints", requireAdmin, async (req, res) => {
  try {
    const { status, priority, department } = req.query as Record<string, string>;
    const conditions: any[] = [];

    if (status) conditions.push(eq(complaintsTable.status, status as any));
    if (priority) conditions.push(eq(complaintsTable.priority, priority as any));
    if (department) conditions.push(eq(complaintsTable.department, department));

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
    req.log.error({ err }, "Admin list complaints error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.get("/stats", requireAdmin, async (req, res) => {
  try {
    const allComplaints = await db
      .select({
        status: complaintsTable.status,
        priority: complaintsTable.priority,
        category: complaintsTable.category,
        updatedAt: complaintsTable.updatedAt,
      })
      .from(complaintsTable);

    const totalUsers = (await db.select({ count: count() }).from(usersTable))[0]?.count ?? 0;

    const byStatus = { SUBMITTED: 0, IN_PROGRESS: 0, RESOLVED: 0, REJECTED: 0 };
    const byPriority = { LOW: 0, MEDIUM: 0, HIGH: 0, URGENT: 0 };
    const byCategory: Record<string, number> = {};
    let resolvedToday = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const c of allComplaints) {
      byStatus[c.status] = (byStatus[c.status] ?? 0) + 1;
      byPriority[c.priority] = (byPriority[c.priority] ?? 0) + 1;
      byCategory[c.category] = (byCategory[c.category] ?? 0) + 1;
      if (c.status === "RESOLVED" && c.updatedAt >= today) {
        resolvedToday++;
      }
    }

    res.json({
      totalComplaints: allComplaints.length,
      byStatus,
      byCategory,
      byPriority,
      totalUsers: Number(totalUsers),
      resolvedToday,
    });
  } catch (err) {
    req.log.error({ err }, "Admin stats error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;
