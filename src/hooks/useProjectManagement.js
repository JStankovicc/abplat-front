import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config/apiConfig";
import { getAuthHeaders } from "../lib/api";
import { determineProjectStatus, convertProfilePicToBase64 } from "../components/project-management/utils";

/**
 * Hook for project management: fetch, create, edit, delete, team.
 */
export const useProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableWorkers, setAvailableWorkers] = useState([]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Niste prijavljeni. Molimo vas da se prijavite.", {
          position: "bottom-right",
          autoClose: 5000,
        });
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/project/allByCompany`, {
        headers: getAuthHeaders(),
      });

      const mappedProjects = response.data.map((project) => ({
        id: project.id,
        name: project.name,
        description: project.description,
        status: determineProjectStatus(project),
        startDate: project.startDate
          ? new Date(project.startDate).toISOString().split("T")[0]
          : null,
        endDate: project.updatedAt
          ? new Date(project.updatedAt).toISOString().split("T")[0]
          : null,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        note: project.note,
        team: project.users
          ? project.users.map((user) => ({
              id: user.id,
              name: user.displayName || "Nepoznat korisnik",
              avatar: user.profilePic
                ? `data:image/jpeg;base64,${convertProfilePicToBase64(user.profilePic)}`
                : process.env.PUBLIC_URL + "/assets/default_profile_picture.png",
            }))
          : [],
      }));

      setProjects(mappedProjects);
    } catch (error) {
      console.error("Greška pri učitavanju projekata:", error);
      toast.error(
        error.response?.data?.message || "Došlo je do greške pri učitavanju projekata.",
        { position: "bottom-right", autoClose: 5000 }
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableWorkers = async (projectId) => {
    try {
      const url = projectId
        ? `${API_BASE_URL}/company/getAllCompanyProjectWorkersNotOnProject?projectId=${projectId}`
        : `${API_BASE_URL}/company/getAllCompanyProjectWorkersNotOnProject`;

      const response = await axios.get(url, { headers: getAuthHeaders() });
      setAvailableWorkers(response.data);
    } catch (error) {
      console.error("Greška pri učitavanju radnika:", error);
      toast.error(
        error.response?.data?.message || "Došlo je do greške pri učitavanju radnika.",
        { position: "bottom-right", autoClose: 5000 }
      );
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    setProjects,
    loading,
    availableWorkers,
    fetchProjects,
    fetchAvailableWorkers,
  };
};
