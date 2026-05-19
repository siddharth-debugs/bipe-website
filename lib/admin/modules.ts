/**
 * Simple, layman-friendly permission catalogue for the BIPE admin.
 *
 * Each entry maps one visible admin module to the backend permission
 * codenames that gate it. Write covers create/update/delete; read covers
 * view-only access to the same module.
 *
 * The backend's ``scope_permission(write_scope, view_codenames=[...])``
 * factory already supports this split — write requests need ``writePerms``,
 * GET/HEAD/OPTIONS need any of ``readPerms``. Nothing on the server side
 * has to change to use this catalogue.
 */
export type ModuleKey =
  | "submissions"
  | "content"
  | "users"
  | "roles";

export type ModuleGroup = "Leads" | "Content" | "System";

export interface ModuleDef {
  key: ModuleKey;
  label: string;
  description: string;
  group: ModuleGroup;
  /** Permission codes that grant write access (create / edit / delete). */
  writePerms: string[];
  /** Permission codes that grant read-only access. */
  readPerms: string[];
}

const SCOPE = {
  panel: "accounts.manage_admin_panel",
  users: "accounts.manage_users",
  roles: "accounts.manage_roles",
  content: "accounts.manage_content",
  subs: "accounts.manage_submissions",
} as const;

/** Anyone with any module permission also needs panel access. We add
 *  this automatically when a role has at least one read/write tick. */
export const PANEL_PERM = SCOPE.panel;

export const MODULES: ModuleDef[] = [
  {
    key: "submissions",
    label: "Submissions",
    description: "Apply, contact and campus-visit form leads.",
    group: "Leads",
    writePerms: [SCOPE.subs],
    readPerms: [
      "submissions.view_applysubmission",
      "submissions.view_contactsubmission",
      "submissions.view_visitsubmission",
    ],
  },
  {
    key: "content",
    label: "Site content",
    description: "Branches, Events, Faculty, Recruiters, Testimonials and Contact info.",
    group: "Content",
    writePerms: [SCOPE.content],
    readPerms: [
      "content.view_event",
      "content.view_testimonial",
      "content.view_facultymember",
      "content.view_recruiter",
      "content.view_branch",
      "content.view_libraryphoto",
      "content.view_alumnus",
      "content.view_pagesection",
      "content.view_contactinfo",
    ],
  },
  {
    key: "users",
    label: "Users",
    description: "Add admin staff, assign roles, disable accounts.",
    group: "System",
    writePerms: [SCOPE.users],
    readPerms: [SCOPE.users],
  },
  {
    key: "roles",
    label: "Roles & permissions",
    description: "Define what each role can read and write.",
    group: "System",
    writePerms: [SCOPE.roles],
    readPerms: [SCOPE.roles],
  },
];

export const MODULE_GROUPS: ModuleGroup[] = ["Leads", "Content", "System"];

export type Access = "none" | "read" | "write";

/** Compute the read/write state of each module given a flat list of
 *  backend codenames currently held by a role. */
export function rolePermsToAccess(perms: readonly string[]): Record<ModuleKey, Access> {
  const set = new Set(perms);
  const out = {} as Record<ModuleKey, Access>;
  for (const m of MODULES) {
    const hasWrite = m.writePerms.some((p) => set.has(p));
    if (hasWrite) {
      out[m.key] = "write";
      continue;
    }
    const hasRead = m.readPerms.some((p) => set.has(p));
    out[m.key] = hasRead ? "read" : "none";
  }
  return out;
}

/** Expand a map of module → access into the flat list of backend
 *  permission codenames that should be saved on the role. */
export function accessToRolePerms(access: Record<ModuleKey, Access>): string[] {
  const codes = new Set<string>();
  let anyGrant = false;
  for (const m of MODULES) {
    const a = access[m.key] ?? "none";
    if (a === "none") continue;
    anyGrant = true;
    // Write implies read — always add read perms when granting write.
    for (const p of m.readPerms) codes.add(p);
    if (a === "write") {
      for (const p of m.writePerms) codes.add(p);
    }
  }
  if (anyGrant) codes.add(PANEL_PERM);
  return Array.from(codes).sort();
}

export function emptyAccess(): Record<ModuleKey, Access> {
  const out = {} as Record<ModuleKey, Access>;
  for (const m of MODULES) out[m.key] = "none";
  return out;
}

/** Group modules for the editor UI. */
export function modulesByGroup(): Record<ModuleGroup, ModuleDef[]> {
  const out: Record<ModuleGroup, ModuleDef[]> = {
    Leads: [], Content: [], System: [],
  };
  for (const m of MODULES) out[m.group].push(m);
  return out;
}
