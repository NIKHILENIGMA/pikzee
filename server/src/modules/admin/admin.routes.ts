import { Router } from 'express'

import { clerkMiddleware } from '@/middlewares'

import { adminController } from './admin.module'

// Initialize the router
const router = Router()

// Define routes and associate them with controller methods
// GET /admin/users - List all users
// POST /admin/users - Create a new user
router
    .route('/users')
    .get(clerkMiddleware, adminController.listUsers)
    .post(clerkMiddleware, adminController.create)

// GET /admin/users/:id - Get user details by ID
// PATCH /admin/users/:id - Update user details by ID
// DELETE /admin/users/:id - Delete user by ID
router
    .route('/users/:id')
    .get(clerkMiddleware, adminController.findById)
    .patch(clerkMiddleware, adminController.update)
    .delete(clerkMiddleware, adminController.delete)

export default router
