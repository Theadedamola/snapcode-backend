import { Request, Response, NextFunction } from 'express'
import passport from 'passport'
import { AuthRequest } from '../middleware/auth.middleware'
import { generateAccessToken, generateRefreshToken } from '../utils/jwt'
import User from '../models/user.model'
import { config } from '../config/config'
import { BadRequestError, UnauthorizedError } from '../utils/errors'

// Model for storing refresh tokens
interface RefreshToken {
  token: string
  userId: string
  expiresAt: Date
}

// In-memory store for refresh tokens (in production, use Redis or DB)
const refreshTokens = new Map<string, RefreshToken>()

/**
 * @desc    Redirect to Google for authentication
 * @route   GET /api/auth/google
 * @access  Public
 */
export const googleAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate('google', { scope: ['profile', 'email'] })(
    req,
    res,
    next
  )
}

/**
 * @desc    Google auth callback
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
export const googleCallback = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate('google', { session: false }, (err, user) => {
    if (err) {
      return next(err)
    }

    if (!user) {
      return next(new UnauthorizedError('Authentication failed'))
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id, user.email)
    const refreshToken = generateRefreshToken(user._id, user.email)

    // Store refresh token
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

    refreshTokens.set(refreshToken, {
      token: refreshToken,
      userId: user._id.toString(),
      expiresAt,
    })

    // Redirect to client with tokens
    res.redirect(
      `${config.CLIENT_URL}/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`
    )
  })(req, res, next)
}

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh-token
 * @access  Public
 */
export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken) {
      throw new BadRequestError('Refresh token is required')
    }

    // Check if refresh token exists and is valid
    const storedToken = refreshTokens.get(refreshToken)

    if (!storedToken || new Date() > storedToken.expiresAt) {
      throw new UnauthorizedError('Invalid or expired refresh token')
    }

    // Find user
    const user = await User.findById(storedToken.userId)

    if (!user) {
      throw new UnauthorizedError('User not found')
    }

    // Generate new access token
    const accessToken = generateAccessToken(user._id, user.email)

    res.status(200).json({ accessToken })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { refreshToken } = req.body

    if (refreshToken) {
      // Remove refresh token
      refreshTokens.delete(refreshToken)
    }

    res.status(200).json({ message: 'Logged out successfully' })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getCurrentUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new UnauthorizedError()
    }

    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
      },
    })
  } catch (error) {
    next(error)
  }
}
