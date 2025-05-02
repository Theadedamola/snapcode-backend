import { Router } from 'express'
import {
  googleAuth,
  googleCallback,
  refreshToken,
  logout,
  getCurrentUser,
} from '../controllers/auth.controller'
import { authenticateJWT } from '../middleware/auth.middleware'

const router = Router()

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     description: Redirects to Google OAuth consent screen
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to Google
 */
router.get('/google', googleAuth)

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the callback from Google OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirects to frontend with tokens
 */
router.get('/google/callback', googleCallback)

/**
 * @swagger
 * /api/auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh-token', refreshToken)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Invalidate refresh token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/logout', authenticateJWT, logout)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user
 *     description: Get the profile of the currently authenticated user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Not authenticated
 */
router.get('/me', authenticateJWT, getCurrentUser)

export default router
