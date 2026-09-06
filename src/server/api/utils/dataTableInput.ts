import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { FilterOperator } from "~/components/shared/DataTable/dataTable.types";

// ── Schemas ───────────────────────────────────────────────────────────────────

export const FilterOperatorSchema = z.nativeEnum(FilterOperator);

export const FilterEntrySchema = z.object({
  operator: FilterOperatorSchema,
  value: z.string().min(1, "Filterwert darf nicht leer sein")
});

export const FilterStateSchema = z.record(z.string(), FilterEntrySchema);

export const SortDirectionSchema = z.enum(["asc", "desc"]);

export const SortStateSchema = z.object({
  key: z.string(),
  direction: SortDirectionSchema
});

export const PaginationStateSchema = z.object({
  cursor: z.string().nullable().default(null),
  pageSize: z.number().int().min(1).max(100).default(25)
});

export const dataTableInputSchema = z.object({
  filter: FilterStateSchema.optional(),
  sort: SortStateSchema.optional(),
  pagination: PaginationStateSchema.optional()
});

export type DataTableInput = z.infer<typeof dataTableInputSchema>;

// ── Hilfsfunktion: FilterState → Prisma where-Klausel ────────────────────────

export function buildPrismaWhereClause(
  filter: DataTableInput["filter"]
): Record<string, unknown> {
  if (!filter) return {};

  const where: Record<string, unknown> = {};

  for (const [key, entry] of Object.entries(filter)) {
    const { operator, value } = entry;

    switch (operator) {
      case FilterOperator.Equals:
        where[key] = { equals: value, mode: "insensitive" };
        break;

      case FilterOperator.NotEquals:
        where[key] = { not: { equals: value, mode: "insensitive" } };
        break;

      case FilterOperator.Contains:
        where[key] = { contains: value, mode: "insensitive" };
        break;

      case FilterOperator.StartsWith:
        where[key] = { startsWith: value, mode: "insensitive" };
        break;

      case FilterOperator.EndsWith:
        where[key] = { endsWith: value, mode: "insensitive" };
        break;

      case FilterOperator.Before: {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Ungültiges Datum für Operator "before": "${value}"`
          });
        }
        where[key] = { lt: date };
        break;
      }

      case FilterOperator.After: {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Ungültiges Datum für Operator "after": "${value}"`
          });
        }
        where[key] = { gt: date };
        break;
      }

      case FilterOperator.OnDate: {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Ungültiges Datum für Operator "onDate": "${value}"`
          });
        }
        // Cover the full calendar day: add exactly 24h in ms to avoid DST shifts
        const nextDay = new Date(date.getTime() + 24 * 60 * 60 * 1000);
        where[key] = { gte: date, lt: nextDay };
        break;
      }
    }
  }

  return where;
}
