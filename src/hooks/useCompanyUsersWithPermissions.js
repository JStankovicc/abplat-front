import { useState, useEffect, useCallback } from "react";
import { getAllCompanyUsersWithPermissions } from "../services/companyService";

/**
 * Učitava listu zaposlenih kompanije sa rolama (GET /company/getAllCompanyUsersWithPermissions).
 * Vraća { users, loading, error, refetch }.
 * users su mapirani na { id, name, email, profilePic, roles }.
 */
export const useCompanyUsersWithPermissions = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCompanyUsersWithPermissions();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message ?? err.message ?? "Greška pri učitavanju zaposlenih.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
};
