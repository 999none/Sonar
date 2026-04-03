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
