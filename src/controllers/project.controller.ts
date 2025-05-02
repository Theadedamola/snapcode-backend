import { Response } from 'express'
import Project from '../models/project.model'
import User from '../models/user.model'
import { Types } from 'mongoose'
import { AuthRequest } from '../middleware/auth.middleware'
import { v4 as uuidv4 } from 'uuid'

// Get all projects for authenticated user
export const getProjects = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id
    const projects = await Project.find({ userId })
    res.json(projects)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' })
  }
}

// Create a new project
export const createProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id
    const { name, frames } = req.body
    // Generate UUID for each frame that doesn't have one
    const framesWithIds = frames.map((frame: any) => ({
      ...frame,
      id: frame.id || uuidv4()
    }))
    const project = await Project.create({ userId, name, frames: framesWithIds })
    // Add project to user's projects array
    await User.findByIdAndUpdate(userId, { $push: { projects: project._id } })
    res.status(201).json(project)
  } catch (err) {
    res.status(400).json({ error: 'Failed to create project' })
  }
}

// Update a project
export const updateProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id
    const { id } = req.params
    const { name, frames } = req.body
    // Generate UUID for each new frame that doesn't have one
    const framesWithIds = frames.map((frame: any) => ({
      ...frame,
      id: frame.id || uuidv4()
    }))
    const project = await Project.findOneAndUpdate(
      { _id: id, userId },
      { name, frames: framesWithIds },
      { new: true }
    )
    if (!project) return res.status(404).json({ error: 'Project not found' })
    res.json(project)
  } catch (err) {
    res.status(400).json({ error: 'Failed to update project' })
  }
}

// Delete a project
export const deleteProject = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user._id
    const { id } = req.params
    const project = await Project.findOneAndDelete({ _id: id, userId })
    if (!project || !('id' in project || '_id' in project))
      return res.status(404).json({ error: 'Project not found' })
    // Remove project from user's projects array
    const projectId = (project as any)._id || (project as any).id
    await User.findByIdAndUpdate(userId, { $pull: { projects: projectId } })
    res.json({ success: true })
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete project' })
  }
}
