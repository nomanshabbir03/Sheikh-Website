import { useEffect, useState } from "react";
import styles from "./TGD.module.css";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function TGD() {
  const [courses, setCourses] = useState([]);
  const [freeResources, setFreeResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchFreeResources();
  }, []);

  async function fetchCourses() {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("is_published", true)
        .order("is_featured", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
      setError("Failed to load courses");
      toast.error("Unable to load courses");
    }
  }

  async function fetchFreeResources() {
    try {
      const { data, error } = await supabase
        .from("free_resources")
        .select("*")
        .eq("is_published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      setFreeResources(data || []);
    } catch (err) {
      console.error("Failed to fetch free resources:", err);
      toast.error("Unable to load free resources");
    } finally {
      setLoading(false);
    }
  }

  function getResourceIcon(type) {
    const icons = {
      Guide: "📖", PDF: "📄", Template: "📋",
      Checklist: "✅", Video: "▶️", Worksheet: "📝",
      Ebook: "📚", Other: "🎁",
    };
    return icons[type] || "🎁";
  }

  function renderCourseCard(course) {
    return (
      <div key={course.id} className={styles.courseCard}>
        <div
          className={course.thumbnail_url
            ? styles.courseThumbnailArea
            : `${styles.courseThumbnailArea} ${styles.placeholder}`}
          style={course.thumbnail_url
            ? { backgroundImage: `url(${course.thumbnail_url})` }
            : {}}
        >
          {!course.thumbnail_url && "🎓"}
          {course.badge_text && (
            <span className={styles.courseBadge}>{course.badge_text}</span>
          )}
        </div>
        <div className={styles.courseBody}>
          <div className={styles.courseCategoryLevel}>
            <span className={styles.courseCategory}>{course.category}</span>
            <span className={styles.courseLevel}>· {course.level}</span>
          </div>
          <h3 className={styles.courseTitle}>{course.title}</h3>
          <p className={styles.courseDescription}>{course.description}</p>
          <div className={styles.courseDetails}>
            {course.duration && <span className={styles.courseDetailPill}>{course.duration}</span>}
            {course.modules && <span className={styles.courseDetailPill}>{course.modules}</span>}
          </div>
          <div className={styles.coursePriceEnroll}>
            <div>
              {course.is_free
                ? <span className={styles.priceFree}>FREE</span>
                : course.price > 0
                  ? <span className={styles.pricePaid}>${course.price}</span>
                  : <span className={styles.priceContact}>Contact for Price</span>
              }
            </div>
            {course.enrollment_url
              ? <a href={course.enrollment_url} target="_blank" rel="noopener noreferrer" className={styles.enrollButton}>Enroll Now →</a>
              : <button className={styles.enrollButtonDisabled} disabled>Coming Soon</button>
            }
          </div>
        </div>
      </div>
    );
  }

  function renderResourceCard(resource) {
    return (
      <div key={resource.id} className={styles.resourceCard}>
        <div className={styles.resourceIcon}>{getResourceIcon(resource.resource_type)}</div>
        <h3 className={styles.resourceTitle}>{resource.title}</h3>
        <p className={styles.resourceDescription}>{resource.description}</p>
        <a href={resource.resource_url} target="_blank" rel="noopener noreferrer" className={styles.resourceButton}>
          Access Free Resource →
        </a>
      </div>
    );
  }

  function SkeletonGrid() {
    return (
      <div className={styles.loadingState}>
        {[1, 2, 3].map(i => (
          <div key={i} className={styles.skeletonCard}>
            <div className={styles.skeletonThumbnail} />
            <div className={styles.skeletonBody}>
              <div className={`${styles.skeletonLine} ${styles.skTitle}`} />
              <div className={`${styles.skeletonLine} ${styles.skText}`} />
              <div className={`${styles.skeletonLine} ${styles.skShort}`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>

      {/* PAGE HEADER */}
      <div className={styles.pageHeader}>
        <p className={styles.headerEyebrow}>TRANSFORM · GROW · DIGITALIZE</p>
        <h1 className={styles.headerTitle}>TGD Learning Hub</h1>
        <p className={styles.headerSubtitle}>
          Premium courses and free resources to accelerate your growth
        </p>
      </div>

      {/* COURSES SECTION */}
      <div className={styles.coursesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>PREMIUM COURSES</p>
            <h2 className={styles.sectionTitle}>Invest in Your Growth</h2>
            <p className={styles.sectionSubtext}>
              Structured learning programs designed by Sheikh Ishtiaq
            </p>
          </div>
          {loading ? <SkeletonGrid /> : error ? (
            <p className={styles.errorText}>{error}</p>
          ) : courses.length === 0 ? (
            <p className={styles.emptyState}>No courses published yet. Check back soon.</p>
          ) : (
            <div className={styles.courseGrid}>{courses.map(renderCourseCard)}</div>
          )}
        </div>
      </div>

      {/* FREE RESOURCES SECTION */}
      <div className={styles.resourcesSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <p className={styles.sectionEyebrow}>COMPLIMENTARY RESOURCES</p>
            <h2 className={styles.sectionTitle}>Free Resources</h2>
            <p className={styles.sectionSubtext}>
              Download guides, templates and tools — completely free
            </p>
          </div>
          {loading ? <SkeletonGrid /> : error ? (
            <p className={styles.errorText}>{error}</p>
          ) : freeResources.length === 0 ? (
            <p className={styles.emptyState}>No free resources yet. Check back soon.</p>
          ) : (
            <div className={styles.resourceGrid}>{freeResources.map(renderResourceCard)}</div>
          )}
        </div>
      </div>

      {/* CTA BANNER */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <h2 className={styles.ctaTitle}>Ready to Transform Your Growth?</h2>
          <p className={styles.ctaSubtext}>Book a strategy session with Sheikh Ishtiaq</p>
          <a href="/contact" className={styles.ctaButton}>Book a Consultation →</a>
        </div>
      </div>

    </div>
  );
}