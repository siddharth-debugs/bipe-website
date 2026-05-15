/**
 * Typed client for the RBAC admin endpoints
 *   /api/v1/users/        — admin user CRUD
 *   /api/v1/roles/        — role (Group) CRUD
 *   /api/v1/permissions/  — read-only permission catalogue
 * plus
 *   /api/v1/roles/permission-catalogue/  — grouped tree for the role editor
 */

import { api } from "@/lib/admin/api";

// ─── Types ────────────────────────────────────────────────────────────────

export interface AdminUserCompact {
  id: number;
  username: string;
  display_name: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  last_login: string | null;
  roles: string[];
  primary_role: string;
}

export interface AdminUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  last_login: string | null;
  date_joined: string;
  profile: {
    display_name: string;
    phone: string;
    email: string;
    avatar_url: string;
    primary_role: number | null;
    is_disabled: boolean;
  };
  role_summary: { id: number; name: string }[];
  permission_codes: string[];
}

export interface AdminUserWrite {
  phone?: string;
  display_name?: string;
  email?: string;
  is_active?: boolean;
  role_ids?: number[];
  primary_role_id?: number | null;
  first_name?: string;
  last_name?: string;
}

export interface Role {
  id: number;
  name: string;
  permission_codes: string[];
  user_count: number;
}

export interface RoleWrite {
  name: string;
  permissions: string[]; // app_label.codename strings
}

export interface PermissionRow {
  id: number;
  codename: string;
  codename_full: string; // app_label.codename
  name: string;
  model: string;
}

export interface PermissionCatalogue {
  scope_perms: { codename: string; label: string }[];
  by_app: Record<string, PermissionRow[]>;
}

// ─── Users ────────────────────────────────────────────────────────────────

export interface ListResponse<T> {
  count?: number;
  next?: string | null;
  previous?: string | null;
  results?: T[];
}

function unwrap<T>(r: T[] | ListResponse<T>): T[] {
  if (Array.isArray(r)) return r;
  return r.results ?? [];
}

export async function listUsers(params: {
  search?: string;
  role?: number;
  active?: boolean;
} = {}): Promise<AdminUserCompact[]> {
  const r = await api<AdminUserCompact[] | ListResponse<AdminUserCompact>>(
    "/users/",
    {
      searchParams: {
        search: params.search,
        role: params.role,
        active: params.active === undefined ? undefined : String(params.active),
      },
    },
  );
  return unwrap(r);
}

export function getUser(id: number | string): Promise<AdminUser> {
  return api<AdminUser>(`/users/${id}/`);
}

export function createUser(body: AdminUserWrite): Promise<AdminUser> {
  return api<AdminUser>("/users/", { method: "POST", body });
}

export function updateUser(id: number | string, body: AdminUserWrite): Promise<AdminUser> {
  return api<AdminUser>(`/users/${id}/`, { method: "PATCH", body });
}

export function deactivateUser(id: number | string): Promise<void> {
  return api<void>(`/users/${id}/`, { method: "DELETE" });
}

export function resetUserRoles(id: number | string): Promise<AdminUser> {
  return api<AdminUser>(`/users/${id}/reset-roles/`, { method: "POST" });
}

// ─── Roles ────────────────────────────────────────────────────────────────

export async function listRoles(params: { search?: string } = {}): Promise<Role[]> {
  const r = await api<Role[] | ListResponse<Role>>("/roles/", {
    searchParams: { search: params.search },
  });
  return unwrap(r);
}

export function getRole(id: number | string): Promise<Role> {
  return api<Role>(`/roles/${id}/`);
}

export function createRole(body: RoleWrite): Promise<Role> {
  return api<Role>("/roles/", { method: "POST", body });
}

export function updateRole(id: number | string, body: Partial<RoleWrite>): Promise<Role> {
  return api<Role>(`/roles/${id}/`, { method: "PATCH", body });
}

export function deleteRole(id: number | string): Promise<void> {
  return api<void>(`/roles/${id}/`, { method: "DELETE" });
}

export function getPermissionCatalogue(): Promise<PermissionCatalogue> {
  return api<PermissionCatalogue>("/roles/permission-catalogue/");
}
