import { tool } from "ai";
import { z } from "zod";

/**
 * Business tools the LLM can call (T1-3).
 *
 * A "tool" (a.k.a. function calling) lets the model decide, mid-answer, to run
 * one of our functions, get the result, then answer using it.
 *
 * Data here is MOCKED — a real database arrives in T1-4. Each execute() logs
 * its call so we can see the model picking the right tool (acceptance criterion).
 */

// --- Mock data ------------------------------------------------------------

const ORDERS: Record<string, { id: string; status: string; customerId: string; total: number }> = {
  "1234": { id: "1234", status: "delayed", customerId: "C-1", total: 320.5 },
  "1235": { id: "1235", status: "shipped", customerId: "C-2", total: 90.0 },
};

const CUSTOMERS: Record<string, { id: string; name: string; tier: string }> = {
  "C-1": { id: "C-1", name: "Acme Manufacturing", tier: "enterprise" },
  "C-2": { id: "C-2", name: "Bolt Distribution", tier: "standard" },
};

const SUPPLIERS: Record<string, { id: string; name: string; leadTimeDays: number }> = {
  "S-1": { id: "S-1", name: "SteelWorks GmbH", leadTimeDays: 14 },
  "S-2": { id: "S-2", name: "FastParts Co", leadTimeDays: 5 },
};

// --- Tools ----------------------------------------------------------------

export const getOrder = tool({
  description: "Look up an order by its id. Returns status, customer, and total.",
  inputSchema: z.object({
    id: z.string().describe("The order id, e.g. 1234"),
  }),
  execute: async ({ id }) => {
    console.log("[tool] getOrder", { id });
    return ORDERS[id] ?? { error: `No order found with id ${id}` };
  },
});

export const getCustomer = tool({
  description: "Look up a customer by their id. Returns name and account tier.",
  inputSchema: z.object({
    id: z.string().describe("The customer id, e.g. C-1"),
  }),
  execute: async ({ id }) => {
    console.log("[tool] getCustomer", { id });
    return CUSTOMERS[id] ?? { error: `No customer found with id ${id}` };
  },
});

export const getSupplier = tool({
  description: "Look up a supplier by their id. Returns name and lead time in days.",
  inputSchema: z.object({
    id: z.string().describe("The supplier id, e.g. S-1"),
  }),
  execute: async ({ id }) => {
    console.log("[tool] getSupplier", { id });
    return SUPPLIERS[id] ?? { error: `No supplier found with id ${id}` };
  },
});

/** All business tools, keyed by the name the model uses to call them. */
export const businessTools = { getOrder, getCustomer, getSupplier };
