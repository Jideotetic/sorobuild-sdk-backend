/**
 * @swagger
 * tags:
 *   name: RPC Credits
 *   description: RPC Credits management APIs
 */

/**
 * @swagger
 * /rpc-credits/{accountId}:
 *   get:
 *     summary: Get current rpc credits for a user
 *     tags: [RPC Credits]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start
 *         required: false
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of projects to return
 *     responses:
 *       200:
 *         description: Projects fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Project fetched successfully
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Project'
 *       401:
 *         description: Unauthorized request
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
import { Router } from "express";

const rpcCreditsRouter = Router();

rpcCreditsRouter.get("/", () => {});

export default rpcCreditsRouter;
