import { describe, expect, it } from "vitest";
import { dataTableInputSchema } from "~/server/api/utils/dataTableInput";

describe("dataTableInputSchema", () => {
  // ── Valid inputs ─────────────────────────────────────────────────────────

  describe("valid inputs", () => {
    it("accepts an empty object", () => {
      const result = dataTableInputSchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it("accepts a filter with a valid operator and non-empty value", () => {
      const result = dataTableInputSchema.safeParse({
        filter: { email: { operator: "contains", value: "test" } }
      });
      expect(result.success).toBe(true);
    });

    it("accepts a sort with a valid key and direction", () => {
      const result = dataTableInputSchema.safeParse({
        sort: { key: "username", direction: "asc" }
      });
      expect(result.success).toBe(true);
    });

    it("accepts pagination with cursor null and a valid pageSize", () => {
      const result = dataTableInputSchema.safeParse({
        pagination: { cursor: null, pageSize: 10 }
      });
      expect(result.success).toBe(true);
    });

    it("accepts a full input combining filter, sort, and pagination", () => {
      const result = dataTableInputSchema.safeParse({
        filter: { username: { operator: "startsWith", value: "admin" } },
        sort: { key: "createdAt", direction: "desc" },
        pagination: { cursor: "ck_abc123", pageSize: 50 }
      });
      expect(result.success).toBe(true);
    });
  });

  // ── Invalid inputs ────────────────────────────────────────────────────────

  describe("invalid inputs", () => {
    it("rejects a filter with an unknown operator", () => {
      const result = dataTableInputSchema.safeParse({
        filter: { email: { operator: "INVALID_OP", value: "x" } }
      });
      expect(result.success).toBe(false);
    });

    it("rejects a filter with an empty value (violates min(1))", () => {
      const result = dataTableInputSchema.safeParse({
        filter: { email: { operator: "equals", value: "" } }
      });
      expect(result.success).toBe(false);
    });

    it("rejects pagination with a negative pageSize", () => {
      const result = dataTableInputSchema.safeParse({
        pagination: { cursor: null, pageSize: -1 }
      });
      expect(result.success).toBe(false);
    });

    it("rejects pagination with pageSize greater than 100", () => {
      const result = dataTableInputSchema.safeParse({
        pagination: { cursor: null, pageSize: 101 }
      });
      expect(result.success).toBe(false);
    });

    it("rejects a sort with an invalid direction", () => {
      const result = dataTableInputSchema.safeParse({
        sort: { key: "name", direction: "random" }
      });
      expect(result.success).toBe(false);
    });
  });
});
