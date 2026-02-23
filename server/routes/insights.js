// server/routes/insights.js
// Public read routes for blog posts / insights

import { Router } from 'express'
import {
  listInsights,
  getInsight,
  getFeaturedInsights,
} from '../controllers/insightController.js'

const router = Router()

router.get('/',          listInsights)
router.get('/featured',  getFeaturedInsights)
router.get('/:slug',     getInsight)

export default router