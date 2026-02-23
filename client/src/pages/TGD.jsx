import { useEffect, useState } from "react";
import styles from "./TGD.module.css";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function TGD() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (error) {
      setError("Failed to load courses");
      toast.error("Unable to load courses");
    } else {
      setCourses(data);
    }

    setLoading(false);
  }

  return (
    <div className="section container">
      {/* Header */}
      <div className={styles.header}>
        <p className="eyebrow">TGD Ecosystem</p>
        <h1 className="display-title">
          Transform. <em>Grow.</em> Digitalize.
        </h1>
        <div className="gold-line"></div>
        <p className={styles.subtitle}>
          TGD is a structured learning ecosystem designed for professionals,
          founders and ambitious individuals who want strategic clarity.
        </p>
      </div>

      {/* Courses */}
      <div className={styles.courseGrid}>
        {loading && <p className={styles.message}>Loading courses...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading &&
          !error &&
          courses.map((course) => (
            <div key={course.id} className={styles.card}>
              {course.badge_text && (
                <span className={styles.badge}>{course.badge_text}</span>
              )}

              <h3>{course.title}</h3>
              <p className={styles.meta}>
                {course.duration} · {course.level}
              </p>
              <p className={styles.description}>
                {course.description?.slice(0, 120)}...
              </p>

              <div className={styles.footer}>
                <span className={styles.price}>${course.price}</span>
                <button className="btn-gold">Enroll Now</button>
              </div>
            </div>
          ))}
      </div>

      {/* Free Resources */}
      <div className={styles.resources}>
        <h2 className="display-title">
          Free <em>Resources</em>
        </h2>
        <div className="gold-line"></div>
        <div className={styles.resourceGrid}>
          <div className={styles.resourceCard}>
            Strategic Thinking Framework (PDF)
          </div>
          <div className={styles.resourceCard}>
            Personal Brand Blueprint
          </div>
          <div className={styles.resourceCard}>
            Geopolitics Explained Mini-Series
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className={styles.cta}>
        <h2>Ready to upgrade your thinking?</h2>
        <button className="btn-dark">Start Learning Today</button>
      </div>
    </div>
  );
}
