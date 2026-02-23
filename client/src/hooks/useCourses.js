// Custom hook for fetching and managing course data
import { useState, useEffect } from 'react';

export const useCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // TODO: Fetch courses from API
    setLoading(false);
  }, []);

  return { courses, loading, error };
};
