const BASEURI = import.meta.env.VITE_API_URI || "";

function getAccessToken() {
  return localStorage.getItem("adminAccessToken") || localStorage.getItem("adminToken");
}

function getRefreshToken() {
  return localStorage.getItem("adminRefreshToken");
}

function saveAuthTokens(data) {
  if (data.access_token) {
    localStorage.setItem("adminAccessToken", data.access_token);
    localStorage.setItem("adminToken", data.access_token);
  }

  if (data.refresh_token) {
    localStorage.setItem("adminRefreshToken", data.refresh_token);
  }
}

function clearAuthTokens() {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminToken");
}

function getAdminHeaders() {
  const token = getAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}

function redirectToAdminLogin() {
  clearAuthTokens();

  if (!window.location.pathname.includes("/admin/login")) {
    window.location.href = "/admin/login";
  }
}

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Missing refresh token");
  }

  const res = await fetch(`${BASEURI}/api/admin/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) {
    throw new Error("Refresh failed");
  }

  const data = await res.json();
  saveAuthTokens(data);

  return data.access_token;
}

async function request(method, url, data = null, admin = false, retry = true) {
  const headers = {
    "Content-Type": "application/json",
    ...(admin ? getAdminHeaders() : {}),
  };

  const opts = {
    method,
    headers,
  };

  if (data) {
    opts.body = JSON.stringify(data);
  }

  const res = await fetch(BASEURI + url, opts);

  if ((res.status === 401 || res.status === 403) && admin && retry) {
    try {
      const newAccessToken = await refreshAccessToken();

      const retryHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newAccessToken}`,
      };

      const retryOpts = {
        method,
        headers: retryHeaders,
      };

      if (data) {
        retryOpts.body = JSON.stringify(data);
      }

      const retryRes = await fetch(BASEURI + url, retryOpts);

      if (!retryRes.ok) {
        redirectToAdminLogin();
        throw new Error(`Error ${retryRes.status}: ${retryRes.statusText}`);
      }

      if (retryRes.status === 204) return null;

      return retryRes.json();
    } catch {
      redirectToAdminLogin();
      throw new Error("Authentication failed");
    }
  }

  if (!res.ok) {
    let message = `Error ${res.status}: ${res.statusText}`;

    try {
      const err = await res.json();
      message = err.error || err.message || message;
    } catch {
      // ignore json parse failure
    }

    throw new Error(message);
  }

  if (res.status === 204) return null;

  return res.json();
}

export const api = {
  getTopics: () => request("GET", "/api/topics"),

  getLesson: (slug) => request("GET", `/api/lessons/${slug}`),

  getLessonsByTopic: async (slug, level) => {
    const res = await request("GET", `/api/topics/${slug}/lessons?level=${level}`);
    return res.items ?? [];
  },

  getLessonsBy: async (slug, level) => {
    const res = await request("GET", `/api/topics/${slug}/lessons?level=${level}`);
    return res.items ?? [];
  },

  sendFeedback: (payload) => request("POST", "/api/feedback", payload),

  getSuggestions: (status = "all") =>
    request("GET", `/api/admin/suggestions?status=${status}`, null, true),

  updateSuggestion: (id, data) =>
    request("PUT", `/api/admin/suggestions/${id}`, data, true),

  deleteSuggestion: (id) => request("DELETE", `/api/admin/suggestions/${id}`, null, true),

  adminLogin: async (payload) => {
    const data = await request("POST", "/api/admin/login", payload);
    saveAuthTokens(data);
    return data;
  },

  adminLogout: () => {
    clearAuthTokens();
    window.location.href = "/";
  },

  isAdminLoggedIn: () => {
    return Boolean(getAccessToken());
  },

  getAdminMe: () => request("GET", "/api/admin/me", null, true),

  createTopic: (data) => request("POST", "/api/topics", data, true),
  updateTopic: (slug, data) => request("PUT", `/api/topics/${slug}`, data, true),
  deleteTopic: (slug) => request("DELETE", `/api/topics/${slug}`, null, true),

  createLesson: (data) => request("POST", "/api/lessons", data, true),
  updateLesson: (slug, data) => request("PUT", `/api/lessons/${slug}`, data, true),
  deleteLesson: (slug) => request("DELETE", `/api/lessons/${slug}`, null, true),

  adminCreateTopic: (data) => request("POST", "/api/topics", data, true),
  adminUpdateTopic: (slug, data) => request("PUT", `/api/topics/${slug}`, data, true),
  adminDeleteTopic: (slug) => request("DELETE", `/api/topics/${slug}`, null, true),

  adminCreateLesson: (data) => request("POST", "/api/lessons", data, true),
  adminUpdateLesson: (slug, data) => request("PUT", `/api/lessons/${slug}`, data, true),
  adminDeleteLesson: (slug) => request("DELETE", `/api/lessons/${slug}`, null, true),
};
