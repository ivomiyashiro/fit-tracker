type RequestConfig = RequestInit & {
  headers?: Record<string, string>;
};

class ApiClient {
  private readonly baseURL: string;

  constructor(baseURL: string = `/api`) {
    this.baseURL = baseURL;
  }

  async request<T = unknown>(endpoint: string, options: RequestConfig = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestConfig = {
      credentials: "include",
      ...options,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    if (response.status === 204) {
      return null as unknown as T;
    }

    const result = await response.json();

    return result as unknown as T;
  }

  async get<T = unknown>(
    endpoint: string,
    options: Omit<RequestConfig, "method" | "body"> & { query?: Record<string, string | number> } = {},
  ): Promise<T> {
    let url = endpoint;
    if (options.query) {
      const searchParams = new URLSearchParams(
        Object.entries(options.query).map(([key, value]) => [key, String(value)]),
      );
      url += `?${searchParams.toString()}`;
    }

    return await this.request<T>(url, {
      ...options,
      method: "GET",
    });
  }

  async post<D = unknown, T = unknown>(
    endpoint: string,
    data?: D,
    options: Omit<RequestConfig, "method" | "body"> = {},
  ): Promise<T> {
    return await this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<D = unknown, T = unknown>(
    endpoint: string,
    data?: D,
    options: Omit<RequestConfig, "method" | "body"> = {},
  ): Promise<T> {
    return await this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<D = unknown, T = unknown>(
    endpoint: string,
    data?: D,
    options: Omit<RequestConfig, "method" | "body"> = {},
  ): Promise<T> {
    return await this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<D = unknown, T = unknown>(
    endpoint: string,
    data?: D,
    options: Omit<RequestConfig, "method" | "body"> = {},
  ): Promise<T> {
    return await this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
