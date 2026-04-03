import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const api = axios.create({
  baseURL: BACKEND_URL,
  headers: { "Content-Type": "application/json" },
});

// Set auth header for all requests
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

// Convert API project to frontend task format
export function projectToTask(project) {
  return {
    id: project.id,
    projectType: project.type,
    projectName: project.name,
    prompt: project.prompt,
    timestamp: new Date(project.updated_at).getTime(),
    // Keep full project data for AppBuilder
    _project: project,
  };
}

// ── CRUD Operations ──

export async function fetchProjects() {
  const res = await api.get("/api/projects");
  return res.data;
}

export async function createProject({ name, prompt, type, model, mode }) {
  const res = await api.post("/api/projects", {
    name: name || "untitled-app",
    prompt,
    type: type || "custom",
    model: model || "gpt-4o",
    mode: mode || "S-1",
  });
  return res.data;
}

export async function getProject(projectId) {
  const res = await api.get(`/api/projects/${projectId}`);
  return res.data;
}

export async function updateProject(projectId, updates) {
  const res = await api.patch(`/api/projects/${projectId}`, updates);
  return res.data;
}

export async function deleteProject(projectId) {
  const res = await api.delete(`/api/projects/${projectId}`);
  return res.data;
}

// ── LLM Generation (SSE) ──

/**
 * Call /api/generate with SSE streaming.
 * @param {Object} params - { prompt, model, mode, project_id }
 * @param {Function} onChunk - Called with each code chunk string
 * @param {Function} onDone - Called with the full generated code
 * @param {Function} onError - Called with error message
 * @returns {AbortController} - Call .abort() to cancel
 */
export function generateCode({ prompt, model, mode, project_id }, onChunk, onDone, onError) {
  const controller = new AbortController();

  const token = api.defaults.headers.common["Authorization"]?.replace("Bearer ", "") || "";

  fetch(`${BACKEND_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ prompt, model: model || "gpt-4o", mode: mode || "S-1", project_id }),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "chunk") {
                onChunk?.(data.content);
              } else if (data.type === "done") {
                onDone?.(data.full_code);
              } else if (data.type === "error") {
                onError?.(data.message);
              }
            } catch (e) {
              // Ignore parse errors for partial data
            }
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        onError?.(err.message);
      }
    });

  return controller;
}

/**
 * Call /api/chat with SSE streaming.
 * @param {Object} params - { message, current_code, model, mode, project_id }
 * @param {Function} onChunk - Called with each code chunk string
 * @param {Function} onDone - Called with the full modified code
 * @param {Function} onError - Called with error message
 * @returns {AbortController} - Call .abort() to cancel
 */
export function chatWithCode({ message, current_code, model, mode, project_id }, onChunk, onDone, onError) {
  const controller = new AbortController();

  const token = api.defaults.headers.common["Authorization"]?.replace("Bearer ", "") || "";

  fetch(`${BACKEND_URL}/api/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, current_code: current_code || "", model: model || "gpt-4o", mode: mode || "S-1", project_id }),
    signal: controller.signal,
  })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === "chunk") {
                onChunk?.(data.content);
              } else if (data.type === "done") {
                onDone?.(data.full_code);
              } else if (data.type === "error") {
                onError?.(data.message);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
    })
    .catch((err) => {
      if (err.name !== "AbortError") {
        onError?.(err.message);
      }
    });

  return controller;
}
