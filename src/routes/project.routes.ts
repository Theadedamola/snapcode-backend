import { Router } from 'express'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller'
import { authenticateJWT } from '../middleware/auth.middleware'

const router = Router()

/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects
 *     description: Get all projects for the authenticated user
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Failed to fetch projects
 */
router.get('/', authenticateJWT, getProjects)

/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     description: Create a new project with name and frames
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               frames:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 */
router.post('/', authenticateJWT, createProject)

/**
 * @swagger
 * /api/projects/{id}:
 *   put:
 *     summary: Update a project
 *     description: Update an existing project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             properties:
 *               name:
 *                 type: string
 *               frames:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Project not found
 */
router.put('/:id', authenticateJWT, updateProject)

/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     description: Delete a project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       400:
 *         description: Failed to delete project
 *       401:
 *         description: Not authenticated
 *       404:
 *         description: Project not found
 */
router.delete('/:id', authenticateJWT, deleteProject)

export default router
