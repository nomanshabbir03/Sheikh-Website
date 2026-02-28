// adminCourseController.js
// Full CRUD operations for TGD courses (admin only)

import { supabase } from '../config/supabase.js'

// GET /api/admin/courses — list all courses (admin)
export async function listCoursesAdmin(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return res.json({
      success: true,
      count: data.length,
      data,
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/admin/courses — create new course
export async function createCourse(req, res, next) {
  try {
    const {
      title,
      slug,
      description,
      category,
      level,
      duration,
      modules,
      price,
      is_free,
      is_featured,
      is_published,
      thumbnail_url,
      enrollment_url,
      badge_text
    } = req.body

    // Generate slug if not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const { data, error } = await supabase
      .from('courses')
      .insert([{
        title,
        slug: finalSlug,
        description,
        category,
        level,
        duration,
        modules,
        price: is_free ? 0 : price,
        is_free: is_free || false,
        is_featured: is_featured || false,
        is_published: is_published || false,
        thumbnail_url,
        enrollment_url,
        badge_text
      }])
      .select()
      .single()

    if (error) throw error

    return res.json({
      success: true,
      data,
    })
  } catch (err) {
    next(err)
  }
}

// PUT /api/admin/courses/:id — update course
export async function updateCourse(req, res, next) {
  try {
    const { id } = req.params
    const {
      title,
      slug,
      description,
      category,
      level,
      duration,
      modules,
      price,
      is_free,
      is_featured,
      is_published,
      thumbnail_url,
      enrollment_url,
      badge_text
    } = req.body

    // Generate slug if title changed and slug not provided
    const finalSlug = slug || title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const { data, error } = await supabase
      .from('courses')
      .update({
        title,
        slug: finalSlug,
        description,
        category,
        level,
        duration,
        modules,
        price: is_free ? 0 : price,
        is_free: is_free || false,
        is_featured: is_featured || false,
        is_published: is_published || false,
        thumbnail_url,
        enrollment_url,
        badge_text
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return res.json({
      success: true,
      data,
    })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/admin/courses/:id — delete course
export async function deleteCourse(req, res, next) {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)

    if (error) throw error

    return res.json({
      success: true,
      message: 'Course deleted successfully',
    })
  } catch (err) {
    next(err)
  }
}
