import { Router } from 'express';
import { generatePNG, getPNGExport, getExports } from '../controllers/export.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticateJWT);

/**
 * @swagger
 * /api/export/png:
 *   post:
 *     summary: Generate PNG export
 *     description: Generate a PNG export from HTML/CSS
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - html
 *             properties:
 *               html:
 *                 type: string
 *                 description: HTML content to render
 *               snippetId:
 *                 type: string
 *                 description: Optional ID of the snippet being exported
 *     responses:
 *       201:
 *         description: PNG export created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 */
router.post('/png', generatePNG);

/**
 * @swagger
 * /api/export/png/{id}:
 *   get:
 *     summary: Get PNG export
 *     description: Get a PNG export by ID
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Export ID
 *     responses:
 *       200:
 *         description: PNG image
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Export not found
 */
router.get('/png/:id', getPNGExport);

/**
 * @swagger
 * /api/export:
 *   get:
 *     summary: Get all exports
 *     description: Get all exports for the current user
 *     tags: [Export]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exports
 *       401:
 *         description: Not authenticated
 */
router.get('/', getExports);

export default router;