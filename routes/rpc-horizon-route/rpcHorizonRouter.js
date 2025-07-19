/**
 * @swagger
 * tags:
 *   name: RPC Horizons
 *   description: RPC Horizons management APIs
 */

import { Router } from "express";

const rpcHorizonRouter = Router();

rpcHorizonRouter.post("/:accountId", () => {});

// rpcHorizonRouter.put("/:accountId", rpcCreditsPayloadSchema, buyRpcCredits);

export default rpcHorizonRouter;
