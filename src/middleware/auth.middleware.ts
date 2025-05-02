import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { UnauthorizedError } from '../utils/errors';

// Define a custom Request interface that includes the user property
export interface AuthRequest extends Request {
  user?: any;
}

// Middleware to authenticate requests using JWT strategy
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    }
    
    if (!user) {
      return next(new UnauthorizedError(info?.message || 'Unauthorized'));
    }
    
    req.user = user;
    next();
  })(req, res, next);
};

// Middleware to check if the user owns a resource
export const checkOwnership = (resourceField: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const resourceId = req.params.id;
      const userId = req.user?._id;
      
      if (!userId) {
        return next(new UnauthorizedError());
      }
      
      // Check if the resource belongs to the user
      // This is a generic check that can be used for different resources
      // The actual implementation will depend on the model being used
      const model = req.app.locals[resourceField];
      if (!model) {
        return next(new Error(`Model ${resourceField} not found`));
      }
      
      const resource = await model.findById(resourceId);
      if (!resource) {
        return next(new Error(`${resourceField} not found`));
      }
      
      if (resource.userId.toString() !== userId.toString()) {
        return next(new UnauthorizedError('You do not have permission to access this resource'));
      }
      
      next();
    } catch (error) {
      next(error);
    }
  };
};