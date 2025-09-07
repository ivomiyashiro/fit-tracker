import { describe, expect, it } from "vitest";

import app from "@/server/app";

describe("/api/health endpoint", () => {
  it("returns OK with 200 status", async () => {
    const response = await app.request("/api/health");

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data).toBe("OK");
  });
});
