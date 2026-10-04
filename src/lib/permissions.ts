import type { Database } from '../types/database'

import { supabase } from './supabase'

export type RolePermission = Database['public']['Tables']['role_permissions']['Row']
export type WorkflowPermission = Database['public']['Tables']['workflow_permissions']['Row']
export type UserRole = Database['public']['Tables']['user_roles']['Row']
export type WorkflowField = Database['public']['Tables']['workflow_fields']['Row']
export type Role = Database['public']['Tables']['roles']['Row']
export type Permission = Database['public']['Tables']['permissions']['Row']

let currentUserRoles: string[] = []
let cachedWorkflowPermissions: WorkflowPermission[] = []
let cachedUserPermissions: string[] = [] // array of permission_key

export async function loadUserPermissions(userId: string) {
  if (!supabase) return

  const { data: userRoles } = await supabase
    .from('user_roles')
    .select('role_id')
    .eq('user_id', userId)

  currentUserRoles = userRoles?.map(ur => ur.role_id) || []

  if (currentUserRoles.length > 0) {
    const { data: wfPerms } = await supabase
      .from('workflow_permissions')
      .select('*')
      .in('role_id', currentUserRoles)
    cachedWorkflowPermissions = wfPerms || []

    const { data: rolePerms } = await supabase
      .from('role_permissions')
      .select('permission_id')
      .in('role_id', currentUserRoles)
    
    if (rolePerms && rolePerms.length > 0) {
      const pIds = rolePerms.map(rp => rp.permission_id)
      const { data: perms } = await supabase
        .from('permissions')
        .select('permission_key')
        .in('id', pIds)
      cachedUserPermissions = perms?.map(p => p.permission_key) || []
    } else {
      cachedUserPermissions = []
    }
  } else {
    cachedWorkflowPermissions = []
    cachedUserPermissions = []
  }
}

export function canViewPage(page: string): boolean {
  if (currentUserRoles.length === 0) return true // fallback
  return cachedUserPermissions.includes('admin') || cachedUserPermissions.includes(`view_${page}`)
}

export function canViewStage(workflowId: string, stageId: string): boolean {
  if (cachedUserPermissions.includes('admin')) return true
  const stagePerms = cachedWorkflowPermissions.filter(wp => wp.workflow_id === workflowId && wp.stage_id === stageId && wp.field_id === null)
  if (stagePerms.length === 0) return true
  return stagePerms.some(wp => wp.can_view)
}

export function canViewField(workflowId: string, stageId: string, fieldId: string): boolean {
  if (cachedUserPermissions.includes('admin')) return true
  const fieldPerms = cachedWorkflowPermissions.filter(wp => wp.workflow_id === workflowId && wp.stage_id === stageId && wp.field_id === fieldId)
  if (fieldPerms.length === 0) return true
  return fieldPerms.some(wp => wp.can_view)
}

export function canEditField(workflowId: string, stageId: string, fieldId: string): boolean {
  if (cachedUserPermissions.includes('admin')) return true
  const fieldPerms = cachedWorkflowPermissions.filter(wp => wp.workflow_id === workflowId && wp.stage_id === stageId && wp.field_id === fieldId)
  if (fieldPerms.length === 0) return true
  return fieldPerms.some(wp => wp.can_edit)
}

export function canPerformAction(workflowId: string, stageId: string, action: 'complete' | 'assign'): boolean {
  if (cachedUserPermissions.includes('admin')) return true
  const stagePerms = cachedWorkflowPermissions.filter(wp => wp.workflow_id === workflowId && wp.stage_id === stageId && wp.field_id === null)
  if (stagePerms.length === 0) return true 
  return stagePerms.some(wp => action === 'complete' ? wp.can_complete : wp.can_assign)
}

export function canAccessRecord(): boolean {
  return true
}
