// adminRoutes.js
// Admin routes for courses and free resources management

import express from 'express'
import {
  listCoursesAdmin,
  createCourse,
  updateCourse,
  deleteCourse
} from '../controllers/adminCourseController.js'

import {
  listFreeResourcesAdmin,
  createFreeResource,
  updateFreeResource,
  deleteFreeResource
} from '../controllers/adminFreeResourceController.js'

const router = express.Router()

// Courses CRUD
router.get('/courses', listCoursesAdmin)
router.post('/courses', createCourse)
router.put('/courses/:id', updateCourse)
router.delete('/courses/:id', deleteCourse)

// Free Resources CRUD
router.get('/free-resources', listFreeResourcesAdmin)
router.post('/free-resources', createFreeResource)
router.put('/free-resources/:id', updateFreeResource)
router.delete('/free-resources/:id', deleteFreeResource)

export default router
