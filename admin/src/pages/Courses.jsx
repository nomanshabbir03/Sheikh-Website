// admin/src/pages/Courses.jsx
// Full CRUD management for TGD courses and free resources

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabase'

const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '4px', padding: '24px' }
const th = { textAlign: 'left', padding: '10px 14px', fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px', textTransform: 'uppercase', borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'monospace' }
const td = { padding: '12px 14px', fontSize: '13px', color: 'rgba(255,255,255,0.75)', borderBottom: '1px solid rgba(255,255,255,0.04)' }

export default function Courses() {
  const [activeTab, setActiveTab] = useState('courses')
  const [courses, setCourses] = useState([])
  const [freeResources, setFreeResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCourseModal, setShowCourseModal] = useState(false)
  const [showResourceModal, setShowResourceModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(null)
  const [editingResource, setEditingResource] = useState(null)

  // Course form state
  const [courseForm, setCourseForm] = useState({
    title: '',
    slug: '',
    description: '',
    category: 'Geopolitics',
    level: 'Beginner',
    duration: '',
    modules: 0,
    price: 0,
    is_free: false,
    is_featured: false,
    is_published: false,
    thumbnail_url: '',
    enrollment_url: '',
    badge_text: ''
  })

  // Free resource form state
  const [resourceForm, setResourceForm] = useState({
    title: '',
    description: '',
    resource_url: '',
    resource_type: 'Guide',
    is_published: true,
    sort_order: 0
  })

  useEffect(() => {
    if (activeTab === 'courses') {
      fetchCourses()
    } else {
      fetchFreeResources()
    }
  }, [activeTab])

  async function fetchCourses() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      setCourses(data || [])
    } catch (err) {
      console.error('Failed to fetch courses:', err)
      toast.error('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  async function fetchFreeResources() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('free_resources')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })
      if (error) throw error
      setFreeResources(data || [])
    } catch (err) {
      console.error('Failed to fetch free resources:', err)
      toast.error('Failed to load free resources')
    } finally {
      setLoading(false)
    }
  }

  // Course CRUD operations
  async function saveCourse() {
    try {
      if (editingCourse) {
        // UPDATE existing course
        const { error } = await supabase
          .from('courses')
          .update({
            title: courseForm.title,
            slug: courseForm.slug,
            description: courseForm.description,
            category: courseForm.category,
            level: courseForm.level,
            duration: courseForm.duration,
            modules: courseForm.modules,
            price: courseForm.price || 0,
            is_free: courseForm.is_free || false,
            is_published: courseForm.is_published || false,
            is_featured: courseForm.is_featured || false,
            thumbnail_url: courseForm.thumbnail_url || null,
            enrollment_url: courseForm.enrollment_url || null,
            badge_text: courseForm.badge_text || null,
          })
          .eq('id', editingCourse.id)
        if (error) throw error
        toast.success('Course updated')
      } else {
        // INSERT new course
        const { error } = await supabase
          .from('courses')
          .insert([{
            title: courseForm.title,
            slug: courseForm.slug,
            description: courseForm.description,
            category: courseForm.category,
            level: courseForm.level,
            duration: courseForm.duration,
            modules: courseForm.modules,
            price: courseForm.price || 0,
            is_free: courseForm.is_free || false,
            is_published: courseForm.is_published || false,
            is_featured: courseForm.is_featured || false,
            thumbnail_url: courseForm.thumbnail_url || null,
            enrollment_url: courseForm.enrollment_url || null,
            badge_text: courseForm.badge_text || null,
          }])
        if (error) throw error
        toast.success('Course created')
      }
      
      setShowCourseModal(false)
      resetCourseForm()
      fetchCourses()
    } catch (error) {
      console.error('Save course failed:', error)
      toast.error('Failed to save course')
    }
  }

  async function deleteCourse(id) {
    if (!window.confirm('Delete this course? This cannot be undone.')) return
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast.success('Course deleted')
      fetchCourses()
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error('Failed to delete course')
    }
  }

  function editCourse(course) {
    setEditingCourse(course)
    setCourseForm({
      title: course.title,
      slug: course.slug,
      description: course.description,
      category: course.category,
      level: course.level,
      duration: course.duration,
      modules: course.modules,
      price: course.price,
      is_free: course.is_free,
      is_featured: course.is_featured,
      is_published: course.is_published,
      thumbnail_url: course.thumbnail_url,
      enrollment_url: course.enrollment_url,
      badge_text: course.badge_text
    })
    setShowCourseModal(true)
  }

  function resetCourseForm() {
    setCourseForm({
      title: '',
      slug: '',
      description: '',
      category: 'Geopolitics',
      level: 'Beginner',
      duration: '',
      modules: 0,
      price: 0,
      is_free: false,
      is_featured: false,
      is_published: false,
      thumbnail_url: '',
      enrollment_url: '',
      badge_text: ''
    })
    setEditingCourse(null)
  }

  // Free Resource CRUD operations
  async function saveResource() {
    try {
      if (editingResource) {
        // UPDATE existing resource
        const { error } = await supabase
          .from('free_resources')
          .update({
            title: resourceForm.title,
            description: resourceForm.description || null,
            resource_url: resourceForm.resource_url,
            resource_type: resourceForm.resource_type || 'Guide',
            is_published: resourceForm.is_published || true,
            sort_order: resourceForm.sort_order || 0,
          })
          .eq('id', editingResource.id)
        if (error) throw error
        toast.success('Resource updated')
      } else {
        // INSERT new resource
        const { error } = await supabase
          .from('free_resources')
          .insert([{
            title: resourceForm.title,
            description: resourceForm.description || null,
            resource_url: resourceForm.resource_url,
            resource_type: resourceForm.resource_type || 'Guide',
            is_published: resourceForm.is_published || true,
            sort_order: resourceForm.sort_order || 0,
          }])
        if (error) throw error
        toast.success('Resource created')
      }
      
      setShowResourceModal(false)
      resetResourceForm()
      fetchFreeResources()
    } catch (error) {
      console.error('Save resource failed:', error)
      toast.error('Failed to save resource')
    }
  }

  async function deleteResource(id) {
    if (!window.confirm('Delete this resource? This cannot be undone.')) return
    try {
      const { error } = await supabase
        .from('free_resources')
        .delete()
        .eq('id', id)
      if (error) throw error
      toast.success('Resource deleted')
      fetchFreeResources()
    } catch (err) {
      console.error('Delete failed:', err)
      toast.error('Failed to delete resource')
    }
  }

  function editResource(resource) {
    setEditingResource(resource)
    setResourceForm({
      title: resource.title,
      description: resource.description,
      resource_url: resource.resource_url,
      resource_type: resource.resource_type,
      is_published: resource.is_published,
      sort_order: resource.sort_order
    })
    setShowResourceModal(true)
  }

  function resetResourceForm() {
    setResourceForm({
      title: '',
      description: '',
      resource_url: '',
      resource_type: 'Guide',
      is_published: true,
      sort_order: 0
    })
    setEditingResource(null)
  }

  function generateSlug(title) {
    return title.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '3px', color: '#C9A227', textTransform: 'uppercase', marginBottom: '6px' }}>TGD Ecosystem</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', color: '#fff' }}>Courses & Resources</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginTop: '4px' }}>Manage courses and free resources</p>
      </div>

      {/* Tab Navigation */}
      <div style={{ 
        borderBottom: '1px solid rgba(255,255,255,0.08)', 
        marginBottom: '24px',
        display: 'flex',
        gap: '0'
      }}>
        <button
          onClick={() => setActiveTab('courses')}
          style={{
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'courses' ? '#C9A227' : 'rgba(255,255,255,0.4)',
            borderBottom: activeTab === 'courses' ? '2px solid #C9A227' : 'none',
            fontFamily: 'Arial',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Courses
        </button>
        <button
          onClick={() => setActiveTab('resources')}
          style={{
            padding: '12px 20px',
            background: 'transparent',
            border: 'none',
            color: activeTab === 'resources' ? '#C9A227' : 'rgba(255,255,255,0.4)',
            borderBottom: activeTab === 'resources' ? '2px solid #C9A227' : 'none',
            fontFamily: 'Arial',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          Free Resources
        </button>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', fontSize: '16px', fontFamily: 'Georgia, serif' }}>Courses</h3>
            <button
              onClick={() => {
                resetCourseForm()
                setShowCourseModal(true)
              }}
              style={{
                background: '#C9A227',
                color: '#0D0D0D',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '2px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              + Add New Course
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px' }}>LOADING...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Thumbnail</th>
                    <th style={th}>Title</th>
                    <th style={th}>Category</th>
                    <th style={th}>Level</th>
                    <th style={th}>Price</th>
                    <th style={th}>Free?</th>
                    <th style={th}>Published</th>
                    <th style={th}>Featured</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map(course => (
                    <tr key={course.id}>
                      <td style={td}>
                        {course.thumbnail_url ? (
                          <img 
                            src={course.thumbnail_url} 
                            alt={course.title}
                            style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '2px' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '60px', 
                            height: '40px', 
                            background: 'rgba(255,255,255,0.1)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            borderRadius: '2px',
                            fontSize: '16px'
                          }}>
                            🎓
                          </div>
                        )}
                      </td>
                      <td style={{ ...td, color: '#fff', maxWidth: '200px' }}>
                        {course.title}
                        {course.badge_text && (
                          <span style={{ 
                            marginLeft: '8px', 
                            fontSize: '10px', 
                            background: 'rgba(201,162,39,0.2)', 
                            color: '#C9A227', 
                            padding: '2px 6px', 
                            borderRadius: '2px' 
                          }}>
                            {course.badge_text}
                          </span>
                        )}
                      </td>
                      <td style={{ ...td, color: '#C9A227' }}>{course.category}</td>
                      <td style={td}>{course.level}</td>
                      <td style={td}>
                        {course.is_free ? (
                          <span style={{ color: '#10B981', fontWeight: 'bold' }}>FREE</span>
                        ) : course.price > 0 ? (
                          <span>${course.price}</span>
                        ) : (
                          <span style={{ color: '#C9A227' }}>Contact</span>
                        )}
                      </td>
                      <td style={td}>
                        <span style={{ 
                          color: course.is_free ? '#10B981' : 'rgba(255,255,255,0.4)',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          {course.is_free ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td style={td}>
                        <span style={{ 
                          color: course.is_published ? '#10B981' : 'rgba(255,255,255,0.4)',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          {course.is_published ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td style={td}>
                        <span style={{ 
                          color: course.is_featured ? '#C9A227' : 'rgba(255,255,255,0.4)',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          {course.is_featured ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td style={td}>
                        <button
                          onClick={() => editCourse(course)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#C9A227',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginRight: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteCourse(course.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Free Resources Tab */}
      {activeTab === 'resources' && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ color: '#fff', fontSize: '16px', fontFamily: 'Georgia, serif' }}>Free Resources</h3>
            <button
              onClick={() => {
                resetResourceForm()
                setShowResourceModal(true)
              }}
              style={{
                background: '#C9A227',
                color: '#0D0D0D',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '2px',
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer'
              }}
            >
              + Add New Resource
            </button>
          </div>

          {loading ? (
            <p style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', letterSpacing: '2px' }}>LOADING...</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={th}>Title</th>
                    <th style={th}>Type</th>
                    <th style={th}>URL</th>
                    <th style={th}>Published</th>
                    <th style={th}>Sort Order</th>
                    <th style={th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {freeResources.map(resource => (
                    <tr key={resource.id}>
                      <td style={{ ...td, color: '#fff', maxWidth: '200px' }}>{resource.title}</td>
                      <td style={{ ...td, color: '#C9A227' }}>{resource.resource_type}</td>
                      <td style={{ ...td, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {resource.resource_url}
                      </td>
                      <td style={td}>
                        <span style={{ 
                          color: resource.is_published ? '#10B981' : 'rgba(255,255,255,0.4)',
                          fontSize: '11px',
                          fontWeight: '700'
                        }}>
                          {resource.is_published ? 'YES' : 'NO'}
                        </span>
                      </td>
                      <td style={td}>{resource.sort_order}</td>
                      <td style={td}>
                        <button
                          onClick={() => editResource(resource)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#C9A227',
                            fontSize: '12px',
                            cursor: 'pointer',
                            marginRight: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteResource(resource.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            fontSize: '12px',
                            cursor: 'pointer'
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Course Modal */}
      {showCourseModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0D0D0D',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            padding: '32px',
            maxWidth: '720px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: '#fff', marginBottom: '24px', fontFamily: 'Georgia, serif' }}>
              {editingCourse ? 'Edit Course' : 'Add New Course'}
            </h2>

            {/* Section 1 - Basic Info */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '16px', fontFamily: 'Arial' }}>Basic Info</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Title *</label>
                <input
                  type="text"
                  value={courseForm.title}
                  onChange={(e) => {
                    const newTitle = e.target.value
                    setCourseForm(prev => ({
                      ...prev,
                      title: newTitle,
                      slug: editingCourse ? prev.slug : generateSlug(newTitle)
                    }))
                  }}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '2px',
                    fontSize: '14px'
                  }}
                  placeholder="Course title"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Slug</label>
                <input
                  type="text"
                  value={courseForm.slug}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, slug: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '2px',
                    fontSize: '14px'
                  }}
                  placeholder="course-slug"
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Category</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, category: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '2px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Geopolitics">Geopolitics</option>
                    <option value="Personal Branding">Personal Branding</option>
                    <option value="Strategic Thinking">Strategic Thinking</option>
                    <option value="Business Strategy">Business Strategy</option>
                    <option value="Digital Growth">Digital Growth</option>
                    <option value="Self-Development">Self-Development</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Level</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, level: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '2px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Badge Text</label>
                <input
                  type="text"
                  value={courseForm.badge_text}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, badge_text: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '2px',
                    fontSize: '14px'
                  }}
                  placeholder="NEW | BESTSELLER | COMING SOON"
                />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>
                  Optional badge shown on course card
                </p>
              </div>
            </div>

            {/* Section 2 - Media */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '16px', fontFamily: 'Arial' }}>Media</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Thumbnail URL</label>
                <input
                  type="text"
                  value={courseForm.thumbnail_url}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '2px',
                    fontSize: '14px'
                  }}
                  placeholder="https://example.com/thumbnail.jpg"
                />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>
                  Direct image URL for course thumbnail
                </p>
                {courseForm.thumbnail_url && (
                  <img 
                    src={courseForm.thumbnail_url} 
                    alt="Thumbnail preview"
                    style={{ height: '120px', marginTop: '8px', borderRadius: '2px', objectFit: 'cover' }}
                  />
                )}
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Enrollment URL *</label>
                <input
                  type="text"
                  value={courseForm.enrollment_url}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, enrollment_url: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '2px',
                    fontSize: '14px'
                  }}
                  placeholder="https://course-platform.com/course-link"
                />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>
                  Link where users go to enroll or access the course
                </p>
              </div>
            </div>

            {/* Section 3 - Details */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '16px', fontFamily: 'Arial' }}>Details</h3>
              
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Description *</label>
                <textarea
                  value={courseForm.description}
                  onChange={(e) => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '2px',
                    fontSize: '14px',
                    minHeight: '100px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe what students will learn in this course"
                  rows={5}
                />
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Duration</label>
                  <input
                    type="text"
                    value={courseForm.duration}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, duration: e.target.value }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '2px',
                      fontSize: '14px'
                    }}
                    placeholder="6 weeks | 4 hours | 12 modules"
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Modules</label>
                  <input
                    type="number"
                    value={courseForm.modules}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, modules: parseInt(e.target.value) || 0 }))}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#fff',
                      padding: '10px',
                      borderRadius: '2px',
                      fontSize: '14px'
                    }}
                    placeholder="12"
                  />
                </div>
              </div>
            </div>

            {/* Section 4 - Pricing */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '16px', fontFamily: 'Arial' }}>Pricing</h3>
              
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Is Free</label>
                  <button
                    onClick={() => setCourseForm(prev => ({ 
                      ...prev, 
                      is_free: !prev.is_free,
                      price: !prev.is_free ? 0 : prev.price
                    }))}
                    style={{
                      background: courseForm.is_free ? '#C9A227' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: courseForm.is_free ? '#0D0D0D' : '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {courseForm.is_free ? 'YES' : 'NO'}
                  </button>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Price</label>
                  <input
                    type="number"
                    value={courseForm.price}
                    onChange={(e) => setCourseForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    disabled={courseForm.is_free}
                    min="0"
                    style={{
                      width: '100%',
                      background: courseForm.is_free ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: courseForm.is_free ? 'rgba(255,255,255,0.3)' : '#fff',
                      padding: '10px',
                      borderRadius: '2px',
                      fontSize: '14px'
                    }}
                    placeholder="49"
                  />
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>
                    Price in USD. Set 0 if free.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 - Settings */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '16px', fontFamily: 'Arial' }}>Settings</h3>
              
              <div style={{ display: 'flex', gap: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Published</label>
                  <button
                    onClick={() => setCourseForm(prev => ({ ...prev, is_published: !prev.is_published }))}
                    style={{
                      background: courseForm.is_published ? '#10B981' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: courseForm.is_published ? '#fff' : '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {courseForm.is_published ? 'YES' : 'NO'}
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Featured</label>
                  <button
                    onClick={() => setCourseForm(prev => ({ ...prev, is_featured: !prev.is_featured }))}
                    style={{
                      background: courseForm.is_featured ? '#C9A227' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      color: courseForm.is_featured ? '#0D0D0D' : '#fff',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {courseForm.is_featured ? 'YES' : 'NO'}
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button
                onClick={() => {
                  setShowCourseModal(false)
                  resetCourseForm()
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '10px 20px',
                  borderRadius: '2px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveCourse}
                disabled={!courseForm.title || !courseForm.description || !courseForm.enrollment_url}
                style={{
                  background: courseForm.title && courseForm.description && courseForm.enrollment_url ? '#C9A227' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: courseForm.title && courseForm.description && courseForm.enrollment_url ? '#0D0D0D' : 'rgba(255,255,255,0.3)',
                  padding: '10px 20px',
                  borderRadius: '2px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: courseForm.title && courseForm.description && courseForm.enrollment_url ? 'pointer' : 'not-allowed'
                }}
              >
                {editingCourse ? 'Update Course' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Free Resource Modal */}
      {showResourceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#0D0D0D',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '4px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: '#fff', marginBottom: '24px', fontFamily: 'Georgia, serif' }}>
              {editingResource ? 'Edit Resource' : 'Add New Resource'}
            </h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Title *</label>
              <input
                type="text"
                value={resourceForm.title}
                onChange={(e) => setResourceForm(prev => ({ ...prev, title: e.target.value }))}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '2px',
                  fontSize: '14px'
                }}
                placeholder="Free Geopolitics Guide 2024"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Resource Type</label>
              <select
                value={resourceForm.resource_type}
                onChange={(e) => setResourceForm(prev => ({ ...prev, resource_type: e.target.value }))}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '2px',
                  fontSize: '14px'
                }}
              >
                <option value="Guide">Guide</option>
                <option value="PDF">PDF</option>
                <option value="Template">Template</option>
                <option value="Checklist">Checklist</option>
                <option value="Video">Video</option>
                <option value="Worksheet">Worksheet</option>
                <option value="Ebook">Ebook</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Description</label>
              <textarea
                value={resourceForm.description}
                onChange={(e) => setResourceForm(prev => ({ ...prev, description: e.target.value }))}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '2px',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'vertical'
                }}
                placeholder="Brief description of this free resource"
                rows={3}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Resource URL *</label>
              <input
                type="text"
                value={resourceForm.resource_url}
                onChange={(e) => setResourceForm(prev => ({ ...prev, resource_url: e.target.value }))}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '2px',
                  fontSize: '14px'
                }}
                placeholder="https://drive.google.com/... or any direct link"
              />
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>
                Link where users can access or download this resource
              </p>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginBottom: '6px' }}>Sort Order</label>
                <input
                  type="number"
                  value={resourceForm.sort_order}
                  onChange={(e) => setResourceForm(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                  min="0"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '10px',
                    borderRadius: '2px',
                    fontSize: '14px'
                  }}
                  placeholder="0"
                />
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', marginTop: '4px' }}>
                  Lower number appears first (0 = top)
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '30px' }}>
                <label style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>Published</label>
                <button
                  onClick={() => setResourceForm(prev => ({ ...prev, is_published: !prev.is_published }))}
                  style={{
                    background: resourceForm.is_published ? '#10B981' : 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: resourceForm.is_published ? '#fff' : '#fff',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  {resourceForm.is_published ? 'YES' : 'NO'}
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button
                onClick={() => {
                  setShowResourceModal(false)
                  resetResourceForm()
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '10px 20px',
                  borderRadius: '2px',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveResource}
                disabled={!resourceForm.title || !resourceForm.resource_url}
                style={{
                  background: resourceForm.title && resourceForm.resource_url ? '#C9A227' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: resourceForm.title && resourceForm.resource_url ? '#0D0D0D' : 'rgba(255,255,255,0.3)',
                  padding: '10px 20px',
                  borderRadius: '2px',
                  fontSize: '13px',
                  fontWeight: '700',
                  cursor: resourceForm.title && resourceForm.resource_url ? 'pointer' : 'not-allowed'
                }}
              >
                {editingResource ? 'Update Resource' : 'Create Resource'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}