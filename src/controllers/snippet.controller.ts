import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middleware/auth.middleware'
import Snippet from '../models/snippet.model'
import User from '../models/user.model'
import Project from '../models/project.model'
import {
  BadRequestError,
  NotFoundError,
  SnippetNotFoundError,
} from '../utils/errors'
import { Types } from 'mongoose'

/**
 * @desc    Create a new snippet
 * @route   POST /api/snippets
 * @access  Private
 */
export const createSnippet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, code, language, position, size, style, projectId } = req.body

    if (
      !title ||
      !code ||
      !language ||
      !position ||
      !size ||
      !style ||
      !projectId
    ) {
      throw new BadRequestError('Please provide all required fields')
    }

    // Check if project exists and user owns it
    const project = await Project.findById(projectId)
    if (!project) {
      throw new NotFoundError('Project not found')
    }
    if (project.userId.toString() !== req.user._id.toString()) {
      throw new NotFoundError('Project not found')
    }

    // Create snippet
    const snippet = await Snippet.create({
      userId: req.user._id,
      projectId,
      title,
      code,
      language,
      position,
      size,
      style,
    })

    // Add snippet to user's snippets array
    await User.findByIdAndUpdate(req.user._id, {
      $push: { snippets: snippet._id },
    })

    res.status(201).json({
      success: true,
      data: snippet,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get all snippets for current user
 * @route   GET /api/snippets
 * @access  Private
 */
export const getSnippets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { projectId } = req.query

    if (!projectId) {
      throw new BadRequestError('Project ID is required')
    }

    // Check if project exists and user owns it
    const project = await Project.findById(projectId)
    if (!project) {
      throw new NotFoundError('Project not found')
    }
    if (project.userId.toString() !== req.user._id.toString()) {
      throw new NotFoundError('Project not found')
    }

    const snippets = await Snippet.find({
      userId: req.user._id,
      projectId,
    }).sort({
      createdAt: -1,
    }) // Sort by newest first

    res.status(200).json({
      success: true,
      count: snippets.length,
      data: snippets,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get snippet by ID
 * @route   GET /api/snippets/:id
 * @access  Private
 */
export const getSnippetById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const snippet = await Snippet.findById(req.params.id)

    if (!snippet) {
      throw new SnippetNotFoundError()
    }

    // Check if user owns the snippet
    if (snippet.userId.toString() !== req.user._id.toString()) {
      throw new NotFoundError('Snippet not found') // For security, don't reveal that the snippet exists
    }

    res.status(200).json({
      success: true,
      data: snippet,
    })
  } catch (error) {
    if (error instanceof Types.ObjectId) {
      return next(new SnippetNotFoundError())
    }
    next(error)
  }
}

/**
 * @desc    Update snippet
 * @route   PUT /api/snippets/:id
 * @access  Private
 */
export const updateSnippet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { title, code, language, position, size, style } = req.body

    // Find snippet
    let snippet = await Snippet.findById(req.params.id)

    if (!snippet) {
      throw new SnippetNotFoundError()
    }

    // Check if user owns the snippet
    if (snippet.userId.toString() !== req.user._id.toString()) {
      throw new NotFoundError('Snippet not found') // For security, don't reveal that the snippet exists
    }

    // Update snippet
    snippet = await Snippet.findByIdAndUpdate(
      req.params.id,
      { title, code, language, position, size, style },
      { new: true, runValidators: true }
    )

    res.status(200).json({
      success: true,
      data: snippet,
    })
  } catch (error) {
    if (error instanceof Types.ObjectId) {
      return next(new SnippetNotFoundError())
    }
    next(error)
  }
}

/**
 * @desc    Delete snippet
 * @route   DELETE /api/snippets/:id
 * @access  Private
 */
export const deleteSnippet = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Find snippet
    const snippet = await Snippet.findById(req.params.id)

    if (!snippet) {
      throw new SnippetNotFoundError()
    }

    // Check if user owns the snippet
    if (snippet.userId.toString() !== req.user._id.toString()) {
      throw new NotFoundError('Snippet not found') // For security, don't reveal that the snippet exists
    }

    // Delete snippet
    await Snippet.findByIdAndDelete(req.params.id)

    // Remove snippet from user's snippets array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { snippets: req.params.id },
    })

    res.status(200).json({
      success: true,
      data: {},
    })
  } catch (error) {
    if (error instanceof Types.ObjectId) {
      return next(new SnippetNotFoundError())
    }
    next(error)
  }
}
