import { useState, useEffect } from "react";

export function useProjects() {
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/data/projects.json");
        if (!response.ok) {
          throw new Error("Failed to load projects data");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = [
    ...new Set(Object.values(projects).map((project) => project.category)),
  ].filter(Boolean);

  return {
    projects,
    loading,
    error,
    categories,
  };
}
