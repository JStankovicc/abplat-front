/**
 * Determines project status based on start date.
 */
export const determineProjectStatus = (project) => {
  if (project.startDate) {
    const startDate = new Date(project.startDate);
    const today = new Date();
    return startDate > today ? "Planiran" : "U toku";
  }
  return "Aktivan";
};

/**
 * Formats date string to DD/MM/YYYY.
 */
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

/**
 * Converts profile picture to Base64 string.
 */
export const convertProfilePicToBase64 = (profilePic) => {
  if (!profilePic || profilePic.length === 0) return null;
  if (typeof profilePic === "string") return profilePic;
  if (Array.isArray(profilePic)) {
    const binary = profilePic.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
    return btoa(binary);
  }
  return null;
};
