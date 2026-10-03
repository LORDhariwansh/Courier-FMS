import { supabase } from './supabase'
import type { Database, Json } from '../types/database'

export type FMSRecord = Database['public']['Tables']['fms_records']['Row']
export type FMSStageInstance = Database['public']['Tables']['fms_stage_instances']['Row']
export type Workflow = Database['public']['Tables']['workflows']['Row']
export type WorkflowStage = Database['public']['Tables']['workflow_stages']['Row']
export type CourierAgent = Database['public']['Tables']['courier_agents']['Row']
export type Department = Database['public']['Tables']['departments']['Row']

export interface RecordWithDetails extends FMSRecord {
  current_stage?: WorkflowStage | null
  stage_instances?: FMSStageInstance[]
  recipient_name?: string
  sender_name?: string
  tracking_number?: string
  courier_agent_name?: string
  department_name?: string
  item_description?: string
  display_record_number?: string | number
}

export const DEFAULT_WORKFLOWS = [
  {
    code: 'OUTWARD',
    name: 'Outward Courier',
    stages: [
      { number: 1, name: 'Request', tat: 4, desc: 'Sender submits dispatch request with package details' },
      { number: 2, name: 'Assign', tat: 2, desc: 'Operations assigns packaging and transport partner' },
      { number: 3, name: 'Prepare', tat: 4, desc: 'Package weighed, labeled, and security packed' },
      { number: 4, name: 'Dispatch Planning', tat: 6, desc: 'Manifest created and pickup scheduled' },
      { number: 5, name: 'Pick Up', tat: 12, desc: 'Carrier collects package and scans initial docket' },
      { number: 6, name: 'Tracking', tat: 48, desc: 'Shipment in-transit with milestone updates' },
      { number: 7, name: 'Acknowledgement', tat: 24, desc: 'Delivery confirmation and receiver sign-off' },
    ]
  },
  {
    code: 'INWARD',
    name: 'Inward Tracking',
    stages: [
      { number: 1, name: 'Docket Received', tat: 2, desc: 'Courier arrives at gate/reception, docket logged' },
      { number: 2, name: 'Track Shipment', tat: 24, desc: 'Package verified, inspected, and logged into mailroom' },
      { number: 3, name: 'Hand Over Material', tat: 12, desc: 'Handed over to internal recipient with acknowledgement' },
    ]
  }
]

export const DEFAULT_COURIER_AGENTS = [
  { name: 'Blue Dart Express', contact_number: '+91 1860 233 1234', email: 'track@bluedart.com' },
  { name: 'DTDC Courier', contact_number: '+91 73057 70577', email: 'customersupport@dtdc.com' },
  { name: 'DHL Express', contact_number: '+91 800 111 345', email: 'support@dhl.com' },
  { name: 'Delhivery', contact_number: '+91 80698 56100', email: 'customer.support@delhivery.com' },
  { name: 'India Post (Speed Post)', contact_number: '+91 1800 266 6868', email: 'support@indiapost.gov.in' },
  { name: 'FedEx India', contact_number: '+91 1800 209 6161', email: 'india@fedex.com' },
]

export const DEFAULT_DEPARTMENTS = [
  { name: 'Administration & Facilities', description: 'Office management & logistics' },
  { name: 'Finance & Accounts', description: 'Invoices, bank drafts, financial docs' },
  { name: 'Human Resources', description: 'Offer letters, employee documents' },
  { name: 'Legal & Compliance', description: 'Contracts, notarized deeds' },
  { name: 'Operations & Procurement', description: 'Samples, spare parts, equipment' },
  { name: 'IT Infrastructure', description: 'Hardware, tokens, SIM cards' },
]

// Fetch all workflows from DB or fallback to defaults
export async function getWorkflows(): Promise<{ workflows: Workflow[]; stages: WorkflowStage[] }> {
  if (!supabase) return { workflows: [], stages: [] }

  try {
    const { data: wfData, error: wfError } = await supabase.from('workflows').select('*').order('name')
    const { data: stData } = await supabase.from('workflow_stages').select('*').order('stage_number')

    if (!wfError && wfData && wfData.length > 0) {
      return { workflows: wfData, stages: stData || [] }
    }
  } catch (e) {
    console.warn('Failed to query workflows from db:', e)
  }

  return { workflows: [], stages: [] }
}

// Fetch all courier agents
export async function getCourierAgents(): Promise<CourierAgent[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase.from('courier_agents').select('*').order('name')
    if (!error && data) return data
  } catch (e) {
    console.warn('Error fetching courier agents:', e)
  }
  return []
}

// Fetch departments
export async function getDepartments(): Promise<Department[]> {
  if (!supabase) return []
  try {
    const { data, error } = await supabase.from('departments').select('*').order('name')
    if (!error && data) return data
  } catch (e) {
    console.warn('Error fetching departments:', e)
  }
  return []
}

// Fetch records with stages
export async function getRecords(workflowId?: string): Promise<RecordWithDetails[]> {
  if (!supabase) return []

  try {
    let query = supabase.from('fms_records').select('*').order('created_at', { ascending: false })
    if (workflowId) {
      query = query.eq('workflow_id', workflowId)
    }

    const { data: records, error } = await query
    if (error || !records) {
      console.warn('Could not query fms_records:', error)
      return []
    }

    // Fetch stages for mapping
    const { data: allStages } = await supabase.from('workflow_stages').select('*')
    const stageMap = new Map((allStages || []).map(s => [s.id, s]))

    // Fetch stage instances
    const recordIds = records.map(r => r.id)
    let instances: FMSStageInstance[] = []
    if (recordIds.length > 0) {
      const { data: instData } = await supabase
        .from('fms_stage_instances')
        .select('*')
        .in('record_id', recordIds)
      if (instData) instances = instData
    }

    return records.map(r => {
      const meta = (typeof r.metadata === 'object' && r.metadata !== null) ? (r.metadata as Record<string, unknown>) : {}
      const curStage = r.current_stage_id ? stageMap.get(r.current_stage_id) || null : null
      const recordInstances = instances.filter(i => i.record_id === r.id)

      const sheetNum = meta.sheet_record_number ? String(meta.sheet_record_number) : null
      return {
        ...r,
        current_stage: curStage,
        stage_instances: recordInstances,
        display_record_number: sheetNum || r.record_number || '1',
        recipient_name: (meta.recipient_name as string) || (meta.to_name as string) || 'Recipient',
        sender_name: (meta.sender_name as string) || (meta.from_name as string) || 'Sender',
        tracking_number: (meta.tracking_number as string) || (meta.docket_number as string) || '',
        courier_agent_name: (meta.courier_agent_name as string) || (meta.carrier as string) || 'Direct',
        department_name: (meta.department_name as string) || 'General',
        item_description: (meta.item_description as string) || (meta.contents as string) || 'Document / Parcel',
      }
    })
  } catch (e) {
    console.error('getRecords failed:', e)
    return []
  }
}

// Create new record
export async function createRecord(params: {
  fms_type_id: string
  workflow_id: string
  initial_stage_id: string
  department_id?: string | null
  metadata: Record<string, unknown>
  user_id?: string | null
}): Promise<{ success: boolean; error?: string; record?: FMSRecord }> {
  if (!supabase) return { success: false, error: 'Database not connected' }

  try {
    const { data: newRecord, error: recError } = await supabase
      .from('fms_records')
      .insert({
        fms_type_id: params.fms_type_id,
        workflow_id: params.workflow_id,
        current_stage_id: params.initial_stage_id,
        department_id: params.department_id || null,
        created_by: params.user_id || null,
        status: 'active',
        metadata: params.metadata as Json,
      })
      .select()
      .single()

    if (recError || !newRecord) {
      return { success: false, error: recError?.message || 'Failed to create record' }
    }

    // Create stage instance for initial stage
    await supabase.from('fms_stage_instances').insert({
      record_id: newRecord.id,
      stage_id: params.initial_stage_id,
      status: 'active',
      started_at: new Date().toISOString(),
    })

    // Log history
    await supabase.from('fms_stage_history').insert({
      record_id: newRecord.id,
      stage_id: params.initial_stage_id,
      action: 'RECORD_CREATED',
      new_status: 'active',
      performed_by: params.user_id || null,
      notes: 'Initial record created at stage 1',
    })

    return { success: true, record: newRecord }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return { success: false, error: msg }
  }
}

// Advance record to next stage
export async function advanceRecordStage(params: {
  record_id: string
  current_stage_id: string
  next_stage_id?: string | null
  notes?: string
  user_id?: string | null
}): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: false, error: 'Database not connected' }

  try {
    const now = new Date().toISOString()

    // 1. Mark current stage instance as completed
    await supabase
      .from('fms_stage_instances')
      .update({
        status: 'completed',
        completed_at: now,
        completed_by: params.user_id || null,
        completion_notes: params.notes || 'Completed and transitioned',
      })
      .eq('record_id', params.record_id)
      .eq('stage_id', params.current_stage_id)

    // 2. If there is a next stage, activate it
    if (params.next_stage_id) {
      await supabase
        .from('fms_records')
        .update({
          current_stage_id: params.next_stage_id,
          updated_at: now,
        })
        .eq('id', params.record_id)

      await supabase.from('fms_stage_instances').insert({
        record_id: params.record_id,
        stage_id: params.next_stage_id,
        status: 'active',
        started_at: now,
      })

      await supabase.from('fms_stage_history').insert({
        record_id: params.record_id,
        stage_id: params.next_stage_id,
        action: 'STAGE_ADVANCED',
        old_status: 'active',
        new_status: 'active',
        performed_by: params.user_id || null,
        notes: params.notes || 'Moved to next stage',
      })
    } else {
      // Completed full workflow!
      await supabase
        .from('fms_records')
        .update({
          status: 'completed',
          completed_at: now,
          updated_at: now,
        })
        .eq('id', params.record_id)

      await supabase.from('fms_stage_history').insert({
        record_id: params.record_id,
        stage_id: params.current_stage_id,
        action: 'WORKFLOW_COMPLETED',
        old_status: 'active',
        new_status: 'completed',
        performed_by: params.user_id || null,
        notes: params.notes || 'Final stage acknowledged. Workflow complete.',
      })
    }

    return { success: true }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return { success: false, error: msg }
  }
}

// Seed initial system workflows and master data if tables are empty
export async function seedInitialDatabase(): Promise<{ success: boolean; message: string }> {
  if (!supabase) return { success: false, message: 'Supabase client not initialized' }

  try {
    // 1. Check if fms_types exist
    const { data: existingTypes } = await supabase.from('fms_types').select('id, code')
    let outwardTypeId = existingTypes?.find(t => t.code === 'OUTWARD')?.id
    let inwardTypeId = existingTypes?.find(t => t.code === 'INWARD')?.id

    if (!outwardTypeId) {
      const { data: newOut } = await supabase.from('fms_types').insert({
        code: 'OUTWARD',
        name: 'Outward Courier',
        description: 'Outbound courier dispatches from request to acknowledgement',
        is_active: true,
      }).select('id').single()
      outwardTypeId = newOut?.id
    }

    if (!inwardTypeId) {
      const { data: newIn } = await supabase.from('fms_types').insert({
        code: 'INWARD',
        name: 'Inward Tracking',
        description: 'Inbound courier dockets from reception to material handover',
        is_active: true,
      }).select('id').single()
      inwardTypeId = newIn?.id
    }

    if (!outwardTypeId || !inwardTypeId) {
      return { success: false, message: 'Could not create or find FMS types.' }
    }

    // 2. Insert Workflows
    const { data: existingWf } = await supabase.from('workflows').select('id, name')
    let outwardWfId = existingWf?.find(w => w.name.includes('Outward'))?.id
    let inwardWfId = existingWf?.find(w => w.name.includes('Inward'))?.id

    if (!outwardWfId) {
      const { data: newWf } = await supabase.from('workflows').insert({
        name: 'Outward Courier Workflow',
        fms_type_id: outwardTypeId,
        is_active: true,
        version: 1,
      }).select('id').single()
      outwardWfId = newWf?.id
    }

    if (!inwardWfId) {
      const { data: newWf } = await supabase.from('workflows').insert({
        name: 'Inward Tracking Workflow',
        fms_type_id: inwardTypeId,
        is_active: true,
        version: 1,
      }).select('id').single()
      inwardWfId = newWf?.id
    }

    // 3. Insert Stages for Outward
    if (outwardWfId) {
      const outwardDef = DEFAULT_WORKFLOWS[0]
      for (const st of outwardDef.stages) {
        await supabase.from('workflow_stages').insert({
          workflow_id: outwardWfId,
          stage_number: st.number,
          stage_name: st.name,
          sort_order: st.number,
          tat_hours: st.tat,
          description: st.desc,
          is_active: true,
        })
      }
    }

    // 4. Insert Stages for Inward
    if (inwardWfId) {
      const inwardDef = DEFAULT_WORKFLOWS[1]
      for (const st of inwardDef.stages) {
        await supabase.from('workflow_stages').insert({
          workflow_id: inwardWfId,
          stage_number: st.number,
          stage_name: st.name,
          sort_order: st.number,
          tat_hours: st.tat,
          description: st.desc,
          is_active: true,
        })
      }
    }

    // 5. Seed Departments
    for (const d of DEFAULT_DEPARTMENTS) {
      await supabase.from('departments').insert({
        name: d.name,
        description: d.description,
        is_active: true,
      })
    }

    // 6. Seed Courier Partners
    for (const ca of DEFAULT_COURIER_AGENTS) {
      await supabase.from('courier_agents').insert({
        name: ca.name,
        contact_number: ca.contact_number,
        email: ca.email,
        is_active: true,
      })
    }

    return { success: true, message: 'Workflows, stages, departments, and courier partners initialized successfully!' }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Unknown error'
    return { success: false, message: msg }
  }
}
