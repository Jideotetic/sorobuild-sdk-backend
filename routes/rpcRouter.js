/**
 * @swagger
 * tags:
 *   name: RPC
 *   description: RPC management APIs
 */

/**
 * @swagger
 * /rpc/{network}:
 *   post:
 *     summary: Make a request to rpc
 *     tags: [RPC]
 *     parameters:
 *       - in: path
 *         name: network
 *         required: true
 *         schema:
 *           type: string
 *         description: The network to call testnet or public
 *       - in: query
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *       - in: query
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

import { Router } from "express";
import { callRPCNetwork } from "../controllers/rpcController.js";

const rpcRouter = Router();

rpcRouter.post("/:network", callRPCNetwork);

export default rpcRouter;
