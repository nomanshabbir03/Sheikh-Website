// courseController.js
// Handles reading TGD courses from Supabase
// Public read access — admin write via Supabase dashboard for now

import { supabase } from '../config/supabase.js'

// GET /api/courses — list all published courses
export async function listCourses(req, res, next) {
  try {
    const { category, level } = req.query

    let query = supabase
      .from('courses')
      .select('id, title, slug, description, category, duration, modules, level, price, is_free, is_featured, thumbnail_url, enrollment_url, badge_text, created_at')
      .eq('is_published', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })

    if (category) query = query.eq('category', category)
    if (level)    query = query.eq('level', level)

    const { data, error } = await query
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

// GET /api/courses/:slug — single course by slug
export async function getCourse(req, res, next) {
  try {
    const { slug } = req.params

    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Course not found',
      })
    }

    return res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

// GET /api/courses/featured — get featured courses only
export async function getFeaturedCourses(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('id, title, slug, description, category, duration, modules, level, badge_text, thumbnail_url')
      .eq('is_published', true)
      .eq('is_featured', true)
      .limit(3)

    if (error) throw error

    return res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}