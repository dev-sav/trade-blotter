import type { Request, Response } from 'express';

import { getUsers } from '../services/userService.js';

export async function getUsersController(
    _req: Request,
    res: Response,
) {
    try {
        const users = await getUsers();

        return res.status(200).json(users);
    } catch (error) {
        console.error('Failed to retrieve users:', error);

        return res.status(500).json({
            message: 'Failed to retrieve users',
        });
    }
}