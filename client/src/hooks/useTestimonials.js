// Custom hook for fetching and managing testimonial data
import { useState, useEffect } from 'react';

export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch testimonials from API
    setLoading(false);
  }, []);

  return { testimonials, loading, error };
};
