import { describe, it, expect } from "vitest";
import {
  insertUserRecipeActionSchema,
  insertExtractedRecipeSchema,
  updateExtractedRecipeSchema,
} from "./schema";

describe("schema validators", () => {
  it("rejects user actions with missing fields", () => {
    const result = insertUserRecipeActionSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts a valid user action", () => {
    const result = insertUserRecipeActionSchema.safeParse({
      userId: "user-123",
      recipeId: "00000000-0000-0000-0000-000000000000",
      action: "cooked",
    });
    expect(result.success).toBe(true);
  });

  it("update extracted recipe schema is fully partial", () => {
    const result = updateExtractedRecipeSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("rejects extracted recipe insert without required fields", () => {
    const result = insertExtractedRecipeSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
