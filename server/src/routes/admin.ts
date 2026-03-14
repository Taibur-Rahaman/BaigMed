import { Router } from 'express';
import { prisma } from '../index.js';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth.js';

const router = Router();

// List users with basic filters (email, clinicName, status/role in future)
router.get('/users', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { search, role, page = '1', limit = '20' } = req.query as {
      search?: string;
      role?: string;
      page?: string;
      limit?: string;
    };

    const pageNum = Math.max(parseInt(page || '1', 10), 1);
    const take = Math.min(Math.max(parseInt(limit || '20', 10), 1), 100);
    const skip = (pageNum - 1) * take;

    const where: any = {};
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { clinicName: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          phone: true,
          clinicName: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({ users, total });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update user role / basic fields (for paid control you can extend later)
router.put('/users/:id', authenticate, requireAdmin, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { role, clinicName, phone } = req.body as {
      role?: string;
      clinicName?: string;
      phone?: string;
    };

    const data: any = {};
    if (role) data.role = role;
    if (clinicName !== undefined) data.clinicName = clinicName;
    if (phone !== undefined) data.phone = phone;

    const user = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        clinicName: true,
      },
    });

    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

