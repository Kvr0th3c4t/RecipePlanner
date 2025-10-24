export const fetchWithAuth = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      sessionStorage.setItem(
        "sessionExpired",
        "Tu sesión ha expirado. Por favor, inicia sesión nuevamente."
      );

      window.location.href = "/";

      throw new Error("SESSION_EXPIRED");
    }

    return response;
  } catch (error) {
    if (error.message === "SESSION_EXPIRED") {
      throw error;
    }

    console.error("Fetch error:", error);
    throw error;
  }
};
