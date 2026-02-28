// insightController.js
// Handles reading insights/blog posts from Supabase
// Public read access — admin write via Supabase dashboard for now

import { supabase } from '../config/supabase.js'

// GET /api/insights — list all published insights
export async function listInsights(req, res, next) {
  try {
    const { category, limit = 10, page = 1 } = req.query
    const from = (page - 1) * limit
    const to   = from + Number(limit) - 1

    let query = supabase
      .from('insights')
      .select('id, title, slug, excerpt, category, cover_image_url, is_featured, read_time, views, author, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .range(from, to)

    if (category && category !== 'All') {
      query = query.eq('category', category)
    }

    const { data, error } = await query
    if (error) throw error

    return res.json({
      success: true,
      count: data.length,
      page: Number(page),
      data,
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/insights/:slug — single insight by slug
export async function getInsight(req, res, next) {
  try {
    const { slug } = req.params

    const { data, error } = await supabase
      .from('insights')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()

    if (error || !data) {
      return res.status(404).json({
        success: false,
        error: 'Insight not found',
      })
    }

    // Increment view count (fire and forget)
    supabase
      .from('insights')
      .update({ views: (data.views || 0) + 1 })
      .eq('id', data.id)
      .then(() => {})

    return res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}

// GET /api/insights/featured — get featured insights
export async function getFeaturedInsights(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('insights')
      .select('id, title, slug, excerpt, category, cover_image_url, read_time, views, created_at')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(3)

    if (error) throw error

    return res.json({ success: true, data })
  } catch (err) {
    next(err)
  }
}