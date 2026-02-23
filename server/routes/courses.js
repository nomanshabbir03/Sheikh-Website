// server/routes/courses.js
// Public read routes for TGD courses

import { Router } from 'express'
import {
  listCourses,
  getCourse,
  getFeaturedCourses,
} from '../controllers/courseController.js'

const router = Router()

router.get('/',          listCourses)
router.get('/featured',  getFeaturedCourses)
router.get('/:slug',     getCourse)

export default router