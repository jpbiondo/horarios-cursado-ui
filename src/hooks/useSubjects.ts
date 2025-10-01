import { useState } from "react";

// Fetching props
interface UseSubjectProps {
  career: string;
  commission: string;
}
export const useSubjects = ({ career, commission }: UseSubjectProps) => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://api.example.com/subjects");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setSubjects(data);
    } catch (error) {
      setError("Error fetching subjects");
    } finally {
      setLoading(false);
    }
  };

  fetchSubjects();

  return { subjects, loading, error };
};
