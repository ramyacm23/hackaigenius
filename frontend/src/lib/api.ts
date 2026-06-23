import type {
  CreateSolutionPayload,
  Solution,
  SolutionList,
} from "./types";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Network error — is the backend running?");
  }

  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (data?.detail) detail = data.detail;
    } catch {
      /* ignore parse error */
    }
    throw new ApiError(res.status, detail);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  createSolution(payload: CreateSolutionPayload): Promise<Solution> {
    return request<Solution>("/solutions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getSolution(id: string): Promise<Solution> {
    return request<Solution>(`/solutions/${id}`);
  },

  listSolutions(limit = 20, offset = 0): Promise<SolutionList> {
    return request<SolutionList>(`/solutions?limit=${limit}&offset=${offset}`);
  },

  deleteSolution(id: string): Promise<void> {
    return request<void>(`/solutions/${id}`, { method: "DELETE" });
  },

  pdfUrl(id: string): string {
    return `${API_URL}/solutions/${id}/pdf`;
  },
};
