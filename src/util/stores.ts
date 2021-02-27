import { writable } from "svelte/store";
import type { User } from "../types/api";

export const user = writable<User | null>(null);
