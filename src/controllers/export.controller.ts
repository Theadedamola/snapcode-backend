import { Response, NextFunction } from 'express'
import puppeteer from 'puppeteer'
import { Readable } from 'stream'
import { AuthRequest } from '../middleware/auth.middleware'
import Export, { getGridFSBucket } from '../models/export.model'
import Snippet from '../models/snippet.model'
import { BadRequestError, NotFoundError } from '../utils/errors'
import { Types } from 'mongoose'

/**
 * @desc    Generate PNG export from HTML/CSS
 * @route   POST /api/export/png
 * @access  Private
 */
export const generatePNG = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { html, snippetId } = req.body

    if (!html) {
      throw new BadRequestError('HTML content is required')
    }

    // Validate snippet exists and belongs to user if snippetId is provided
    if (snippetId) {
      const snippet = await Snippet.findById(snippetId)

      if (!snippet) {
        throw new NotFoundError('Snippet not found')
      }

      if (snippet.userId.toString() !== req.user._id.toString()) {
        throw new NotFoundError('Snippet not found') // Security: don't reveal snippet exists
      }
    }

    // Check if export already exists for this snippet
    if (snippetId) {
      const existingExport = await Export.findOne({
        userId: req.user._id,
        snippetId,
      }).sort({ createdAt: -1 }) // Get the most recent export

      if (existingExport) {
        // Return existing export URL
        return res.status(200).json({
          success: true,
          data: {
            url: `/api/export/png/${existingExport._id}`,
            id: existingExport._id,
          },
        })
      }
    }

    // Generate PNG using Puppeteer
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: 'new',
    })

    const page = await browser.newPage()
    await page.setViewport({ width: 1200, height: 800, deviceScaleFactor: 2 })
    await page.setContent(html, { waitUntil: 'networkidle0' })

    // Take screenshot
    const screenshot = await page.screenshot({ type: 'png' })
    await browser.close()

    // Store in GridFS
    const bucket = getGridFSBucket()
    const uploadStream = bucket.openUploadStream(`export-${Date.now()}.png`, {
      metadata: {
        userId: req.user._id,
        snippetId: snippetId || null,
        contentType: 'image/png',
      },
    })

    const readableStream = new Readable()
    readableStream.push(screenshot)
    readableStream.push(null)

    readableStream.pipe(uploadStream)

    // Create export record
    const exportRecord = await Export.create({
      userId: req.user._id,
      snippetId: snippetId || null,
      fileId: uploadStream.id,
      format: 'png',
    })

    res.status(201).json({
      success: true,
      data: {
        url: `/api/export/png/${exportRecord._id}`,
        id: exportRecord._id,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get PNG export by ID
 * @route   GET /api/export/png/:id
 * @access  Private
 */
export const getPNGExport = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const exportId = req.params.id

    // Find export record
    const exportRecord = await Export.findById(exportId)

    if (!exportRecord) {
      throw new NotFoundError('Export not found')
    }

    // Check if user owns the export
    if (exportRecord.userId.toString() !== req.user._id.toString()) {
      throw new NotFoundError('Export not found') // Security: don't reveal export exists
    }

    // Get file from GridFS
    const bucket = getGridFSBucket()
    const downloadStream = bucket.openDownloadStream(exportRecord.fileId)

    // Set headers
    res.set('Content-Type', 'image/png')
    res.set(
      'Content-Disposition',
      `inline; filename="export-${exportRecord._id}.png"`
    )

    // Pipe file to response
    downloadStream.pipe(res)
  } catch (error: unknown) {
    // Check if error is related to invalid ObjectId format
    if (
      typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      'kind' in error &&
      error.name === 'CastError' &&
      error.kind === 'ObjectId'
    ) {
      return next(new NotFoundError('Export not found'))
    }
    next(error)
  }
}

/**
 * @desc    Get all exports for current user
 * @route   GET /api/export
 * @access  Private
 */
export const getExports = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const exports = await Export.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .populate('snippetId', 'title')

    const formattedExports = exports.map((exp) => ({
      id: exp._id,
      url: `/api/export/png/${exp._id}`,
      snippetId: exp.snippetId || null,
      format: exp.format,
      createdAt: exp.createdAt,
    }))

    res.status(200).json({
      success: true,
      count: exports.length,
      data: formattedExports,
    })
  } catch (error) {
    next(error)
  }
}
