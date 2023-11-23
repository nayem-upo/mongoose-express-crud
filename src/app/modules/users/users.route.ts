// users.routes.ts
import express, { Router } from "express"
import { UserController } from "./users.controller";

const router: Router = express.Router();

// Endpoint: POST /api/users
router.post('/', UserController.createUser);

// Endpoint: GET /api/users to Retrieve a list of all users
router.get('/', UserController.getAllUsers)

// Endpoint: GET /api/users/:userId Retrieve a specific user by ID
router.get('/:userId', UserController.getUserUserId)

// Endpoint: PUT /api/users/:userId Update user information
router.put('/:userId', UserController.updateUser)

// Endpoint: DELETE /api/users/:userId Delete a user
router.delete('/:userId', UserController.deleteUser);

// Endpoint: PUT /api/users/:userId/orders Add New Product in Order
router.put('/:userId/orders', UserController.createOrderToDb)

// Endpoint: GET /api/users/:userId/orders Retrieve all orders for a specific user
router.get('/:userId/orders', UserController.getOrdersByUserId);

// Endpoint: GET /api/users/:userId/orders/total-price Calculate Total Price of Orders for a Specific User
router.get('/:userId/orders/total-price', UserController.calculateTotalPrice);

export const userRoutes = router;