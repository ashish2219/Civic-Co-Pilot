import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import complaintsRouter from "./complaints";
import schemesRouter from "./schemes";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/complaints", complaintsRouter);
router.use("/schemes", schemesRouter);
router.use("/admin", adminRouter);

export default router;
