import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

const router = Router();

const TaskSchema = z.object({
  title: z.string().min(1),
  course: z.string().min(2).max(20).optional(),
  kind: z.enum(['assignment', 'exam', 'lab', 'reading', 'habit', 'errand']),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  estimatedHours: z.number().min(0).max(40).optional(),
  dueAt: z.string().datetime().optional(),
  repeats: z.enum(['daily', 'weekly']).optional(),
  notes: z.string().max(500).optional(),
  status: z.enum(['pending', 'in-progress', 'done']).default('pending'),
});

router.get('/', async (_req, res) => {
  const tasks = await prisma.task.findMany({ orderBy: { dueAt: 'asc' } });
  res.json(tasks);
});

router.post('/', async (req, res) => {
  const parsed = TaskSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }
  const task = await prisma.task.create({ data: parsed.data });
  res.status(201).json(task);
});

router.put('/:id', async (req, res) => {
  const parsed = TaskSchema.partial().safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() });
  }
  const task = await prisma.task.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(task);
});

router.delete('/:id', async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
