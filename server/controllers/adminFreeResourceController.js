// adminFreeResourceController.js
// Full CRUD operations for free resources (admin only)

import { supabase } from '../config/supabase.js'

// GET /api/admin/free-resources — list all free resources (admin)
export async function listFreeResourcesAdmin(req, res, next) {
  try {
    const { data, error } = await supabase
      .from('free_resources')
      .select('*')
      .order('sort_order', { ascending: true })
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

// POST /api/admin/free-resources — create new free resource
export async function createFreeResource(req, res, next) {
  try {
    const {
      title,
      description,
      resource_url,
      resource_type,
      is_published,
      sort_order
    } = req.body

    const { data, error } = await supabase
      .from('free_resources')
      .insert([{
        title,
        description,
        resource_url,
        resource_type: resource_type || 'Guide',
        is_published: is_published !== undefined ? is_published : true,
        sort_order: sort_order || 0
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

// PUT /api/admin/free-resources/:id — update free resource
export async function updateFreeResource(req, res, next) {
  try {
    const { id } = req.params
    const {
      title,
      description,
      resource_url,
      resource_type,
      is_published,
      sort_order
    } = req.body

    const { data, error } = await supabase
      .from('free_resources')
      .update({
        title,
        description,
        resource_url,
        resource_type: resource_type || 'Guide',
        is_published: is_published !== undefined ? is_published : true,
        sort_order: sort_order || 0
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

// DELETE /api/admin/free-resources/:id — delete free resource
export async function deleteFreeResource(req, res, next) {
  try {
    const { id } = req.params

    const { error } = await supabase
      .from('free_resources')
      .delete()
      .eq('id', id)

    if (error) throw error

    return res.json({
      success: true,
      message: 'Free resource deleted successfully',
    })
  } catch (err) {
    next(err)
  }
}
