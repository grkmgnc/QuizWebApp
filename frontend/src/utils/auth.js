import jwt_decode from "jwt-decode";

export const getDecodedToken = () => {
  try {
    const token = localStorage.getItem("jwt_token");
    if (!token) return null;

    const cleanToken = token.replace(/^Bearer\s/, ""); // "Bearer " varsa temizle
    return jwt_decode(cleanToken);
  } catch (error) {
    console.error("Token decode edilemedi:", error.message);
    return null;
  }
};
