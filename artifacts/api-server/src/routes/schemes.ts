import { Router, type IRouter } from "express";
import { db, schemesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { classifyComplaint, recommendSchemeCategories } from "../lib/classifier.js";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const { category, role } = req.query as Record<string, string>;

    const allSchemes = await db.select().from(schemesTable);

    let filtered = allSchemes;
    if (category) {
      filtered = filtered.filter((s) => s.category === category);
    }
    if (role) {
      filtered = filtered.filter((s) => {
        const roles: string[] = JSON.parse(s.eligibleRoles);
        return roles.includes(role);
      });
    }

    res.json(filtered.map((s) => ({ ...s, eligibleRoles: JSON.parse(s.eligibleRoles) })));
  } catch (err) {
    req.log.error({ err }, "List schemes error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

router.post("/recommend", async (req, res) => {
  try {
    const { complaintText, userRole } = req.body;

    if (!complaintText || !userRole) {
      res.status(400).json({ error: "VALIDATION_ERROR", message: "complaintText and userRole are required" });
      return;
    }

    const classification = classifyComplaint(complaintText, complaintText);
    const recommendedCategories = recommendSchemeCategories(classification.category, userRole);

    const allSchemes = await db.select().from(schemesTable);

    const schemes = allSchemes
      .filter((s) => {
        const roles: string[] = JSON.parse(s.eligibleRoles);
        return recommendedCategories.includes(s.category) && roles.includes(userRole);
      })
      .slice(0, 5)
      .map((s) => ({ ...s, eligibleRoles: JSON.parse(s.eligibleRoles) }));

    res.json({ category: classification.category, schemes });
  } catch (err) {
    req.log.error({ err }, "Recommend schemes error");
    res.status(500).json({ error: "SERVER_ERROR", message: "Internal server error" });
  }
});

export default router;
