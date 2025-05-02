import { Router } from 'express'
import {
  createSnippet,
  getSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
} from '../controllers/snippet.controller'
import { authenticateJWT } from '../middleware/auth.middleware'

const router = Router()

// All routes require authentication
router.use(authenticateJWT)

/**
 * @swagger
 * /api/snippets:
 *   post:
 *     summary: Create a new snippet
 *     description: Create a new code snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - code
 *               - language
 *               - style
 *             properties:
 *               title:
 *                 type: string
 *               code:
 *                 type: string
 *               language:
 *                 type: string
 *                 enum: [javascript, python, html]
 *               style:
 *                 type: object
 *                 properties:
 *                   theme:
 *                     type: string
 *                   fontFamily:
 *                     type: string
 *                   backgroundColor:
 *                     type: string
 *                   padding:
 *                     type: array
 *                     items:
 *                       type: number
 *                   shadow:
 *                     type: string
 *     responses:
 *       201:
 *         description: Snippet created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 */
router.post('/', createSnippet)

/**
 * @swagger
 * /api/snippets:
 *   get:
 *     summary: Get all snippets
 *     description: Get all snippets for the current user
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of snippets
 *       401:
 *         description: Not authenticated
 */
router.get('/', getSnippets)

/**
 * @swagger
 * /api/snippets/{id}:
 *   get:
 *     summary: Get snippet by ID
 *     description: Get a specific snippet by its ID
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Snippet ID
 *     responses:
 *       200:
 *         description: Snippet details
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Snippet not found
 */
router.get('/:id', getSnippetById)

/**
 * @swagger
 * /api/snippets/{id}:
 *   put:
 *     summary: Update snippet
 *     description: Update an existing snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Snippet ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               code:
 *                 type: string
 *               language:
 *                 type: string
 *                 enum: [javascript, python, html]
 *               style:
 *                 type: object
 *                 properties:
 *                   theme:
 *                     type: string
 *                   fontFamily:
 *                     type: string
 *                   backgroundColor:
 *                     type: string
 *                   padding:
 *                     type: array
 *                     items:
 *                       type: number
 *                   shadow:
 *                     type: string
 *     responses:
 *       200:
 *         description: Snippet updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Snippet not found
 */
router.put('/:id', updateSnippet)

/**
 * @swagger
 * /api/snippets/{id}:
 *   delete:
 *     summary: Delete snippet
 *     description: Delete an existing snippet
 *     tags: [Snippets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Snippet ID
 *     responses:
 *       200:
 *         description: Snippet deleted successfully
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Snippet not found
 */
router.delete('/:id', deleteSnippet)

export default router
