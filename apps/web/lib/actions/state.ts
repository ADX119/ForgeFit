export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
}

export const initialActionState: ActionState = { status: "idle" };

/** Result of a one-shot mutation (check an item, remove an entry…). Never carries raw database errors. */
export type MutationResult = { ok: true; message?: string } | { ok: false; message: string };

export const ok = (message?: string): MutationResult => ({ ok: true, message });
export const fail = (message: string): MutationResult => ({ ok: false, message });
