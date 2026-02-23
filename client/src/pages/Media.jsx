import { useEffect, useState } from "react";
import styles from "./Media.module.css";
import { supabase } from "../lib/supabase";
import toast from "react-hot-toast";

export default function Media() {
  const [mediaItems, setMediaItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filters = [
    "All",
    "Podcast",
    "Event",
    "Speech",
    "Interview",
    "Webinar",
    "Press",
  ];

  useEffect(() => {
    fetchMedia();
  }, []);

  useEffect(() => {
    if (activeFilter === "All") {
      setFilteredItems(mediaItems);
    } else {
      setFilteredItems(
        mediaItems.filter(
          (item) => item.media_type === activeFilter
        )
      );
    }
  }, [activeFilter, mediaItems]);

  async function fetchMedia() {
    setLoading(true);

    const { data, error } = await supabase
      .from("media_gallery")
      .select("*")
      .eq("is_published", true)
      .order("event_date", { ascending: false });

    if (error) {
      setError("Failed to load media");
      toast.error("Unable to load media items");
    } else {
      setMediaItems(data);
      setFilteredItems(data);
    }

    setLoading(false);
  }

  return (
    <div className="section container">
      {/* Header */}
      <div className={styles.header}>
        <p className="eyebrow">Media & Appearances</p>
        <h1 className="display-title">
          Public <em>Presence</em>
        </h1>
        <div className="gold-line"></div>
        <p className={styles.subtitle}>
          Conferences, interviews, podcasts and global speaking engagements
          across geopolitics, business and mobility.
        </p>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        {filters.map((filter) => (
          <button
            key={filter}
            className={`${styles.filterBtn} ${
              activeFilter === filter ? styles.active : ""
            }`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className={styles.grid}>
        {loading && <p className={styles.message}>Loading media...</p>}
        {error && <p className={styles.error}>{error}</p>}

        {!loading &&
          !error &&
          filteredItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imagePlaceholder}>
                {item.media_type}
              </div>

              <div className={styles.content}>
                <h3>{item.event_name}</h3>
                <p className={styles.meta}>
                  {item.media_type} ·{" "}
                  {new Date(item.event_date).toLocaleDateString()}
                </p>
                <p className={styles.description}>
                  {item.description?.slice(0, 100)}...
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Press Strip */}
      <div className={styles.pressStrip}>
        <h2 className="display-title">
          Featured in <em>Press</em>
        </h2>
        <div className="gold-line"></div>
        <div className={styles.pressLogos}>
          <div>Global News</div>
          <div>Business Today</div>
          <div>Strategic Review</div>
          <div>World Affairs</div>
        </div>
      </div>

      {/* Speaking CTA */}
      <div className={styles.cta}>
        <h2>Invite Sheikh Ishtiaq to Speak</h2>
        <p>
          Available for keynote talks, panels and private executive sessions.
        </p>
        <button className="btn-gold">Enquire for Speaking</button>
      </div>
    </div>
  );
}
