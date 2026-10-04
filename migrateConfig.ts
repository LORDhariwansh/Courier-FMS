import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY!
)

async function runMigration() {
  console.log('Migrating workflow fields...')
  
  // 1. Get the Inward Workflow
  const { data: wf } = await supabase.from('workflows').select('id').eq('name', 'Inward Courier Workflow').single()
  if (!wf) {
    console.error('Inward workflow not found')
    return
  }

  // Define the updated fields
  const inwardFields = [
    // Stage 1 Fields
    { stage_number: 1, field_key: 'timestamp', field_label: 'Timestamp', data_type: 'datetime', is_readonly: true, display_order: 1, configuration: { execution_type: 'system_timestamp', depends_on: { field_key: 'docket_number', operator: 'NOT_NULL' } } },
    { stage_number: 1, field_key: 'docket_number', field_label: 'Docket Number', data_type: 'text', is_required: true, display_order: 2, configuration: { execution_type: 'user_input' } },
    { stage_number: 1, field_key: 'dispatch_date', field_label: 'Dispatch Date', data_type: 'date', is_required: true, display_order: 3, configuration: { execution_type: 'user_input' } },
    { stage_number: 1, field_key: 'courier_agent', field_label: 'Courier Agent Name', data_type: 'dropdown', is_required: true, display_order: 4, configuration: { execution_type: 'user_input', source_config: { type: 'master_data', table: 'courier_agents' } } },
    { stage_number: 1, field_key: 'agent_number', field_label: 'Agent Number', data_type: 'text', is_readonly: true, display_order: 5, configuration: { execution_type: 'dependent_input', depends_on: { field_key: 'courier_agent', operator: 'DEPEND' }, source_config: { type: 'dependent', lookup_table: 'courier_agents', return_field: 'contact_number' } } },
    { stage_number: 1, field_key: 'supplier_name', field_label: 'Supplier Name', data_type: 'text', is_required: true, display_order: 6, configuration: { execution_type: 'user_input' } },
    { stage_number: 1, field_key: 'from_location', field_label: 'From Location', data_type: 'text', is_required: true, display_order: 7, configuration: { execution_type: 'user_input' } },
    { stage_number: 1, field_key: 'material', field_label: 'Material Name', data_type: 'dropdown', is_required: true, display_order: 8, configuration: { execution_type: 'user_input', source_config: { type: 'master_data', table: 'materials' } } },
    { stage_number: 1, field_key: 'department', field_label: 'Department', data_type: 'dropdown', is_required: true, display_order: 9, configuration: { execution_type: 'user_input', source_config: { type: 'master_data', table: 'departments' } } },
    { stage_number: 1, field_key: 'delivery_type', field_label: 'Delivery Type', data_type: 'dropdown', is_required: true, configuration: { execution_type: 'user_input', source_config: { type: 'static', options: ['Factory Delivery', 'Godawn Delivery'] } }, display_order: 10 },
    { stage_number: 1, field_key: 'image_upload', field_label: 'Image Upload', data_type: 'file', is_required: true, display_order: 11, configuration: { execution_type: 'user_input' } },
    // Stage 2 Fields
    { stage_number: 2, field_key: 'tracking_planned', field_label: 'Tracking Planned', data_type: 'datetime', is_readonly: true, display_order: 12, configuration: { execution_type: 'tat_timestamp', depends_on: { field_key: 'timestamp', operator: 'TIME' }, tat_hours: 70 } },
    { stage_number: 2, field_key: 'days_elapsed', field_label: 'Days', data_type: 'number', is_readonly: true, display_order: 13, configuration: { execution_type: 'formula' } },
    { stage_number: 2, field_key: 'tracking_date', field_label: 'Tracking Date', data_type: 'date', display_order: 14, configuration: { execution_type: 'user_input' } },
    { stage_number: 2, field_key: 'tracking_remark', field_label: 'Tracking Remark', data_type: 'textarea', display_order: 15, configuration: { execution_type: 'user_input' } },
    { stage_number: 2, field_key: 'receive_material', field_label: 'Receive Material', data_type: 'boolean', display_order: 16, configuration: { execution_type: 'action' } },
    { stage_number: 2, field_key: 'receive_by', field_label: 'Receive By', data_type: 'user', display_order: 17, configuration: { execution_type: 'user_input', source_config: { type: 'user' } } },
    { stage_number: 2, field_key: 'receive_photo', field_label: 'Upload Photo', data_type: 'file', display_order: 18, configuration: { execution_type: 'user_input' } },
    { stage_number: 2, field_key: 'receive_actual', field_label: 'Receive Actual', data_type: 'datetime', is_readonly: true, display_order: 19, configuration: { execution_type: 'system_timestamp', depends_on: { field_key: 'receive_material', operator: 'TRUE' } } },
    { stage_number: 2, field_key: 'delay_url', field_label: 'Delay URL', data_type: 'url', is_hidden: true, display_order: 20, configuration: { execution_type: 'system_hidden' } },
    // Stage 3 Fields
    { stage_number: 3, field_key: 'handover_planned', field_label: 'Handover Material Planned', data_type: 'datetime', is_readonly: true, display_order: 21, configuration: { execution_type: 'tat_timestamp', depends_on: { field_key: 'receive_actual', operator: 'TIME' }, tat_hours: 2 } },
    { stage_number: 3, field_key: 'handover_to', field_label: 'Handover To', data_type: 'user', display_order: 22, configuration: { execution_type: 'user_input', source_config: { type: 'user' } } },
    { stage_number: 3, field_key: 'handover_actual', field_label: 'Handover Material Actual', data_type: 'datetime', is_readonly: true, display_order: 23, configuration: { execution_type: 'system_timestamp', depends_on: { field_key: 'handover_to', operator: 'NOT_NULL' } } },
    { stage_number: 3, field_key: 'stage_complete', field_label: 'Stage Complete', data_type: 'boolean', is_hidden: true, display_order: 24, configuration: { execution_type: 'formula' } },
    { stage_number: 3, field_key: 'archive_data', field_label: 'Archive Data', data_type: 'boolean', is_hidden: true, display_order: 25, configuration: { execution_type: 'formula' } },
    { stage_number: 3, field_key: 'send_trigger', field_label: 'Send Trigger', data_type: 'boolean', is_hidden: true, display_order: 26, configuration: { execution_type: 'formula' } },
  ]

  const { data: stData } = await supabase.from('workflow_stages').select('id, stage_number').eq('workflow_id', wf.id)
  const stMap = new Map(stData?.map((s: any) => [s.stage_number, s.id]) || [])

  // Upsert the fields
  for (const f of inwardFields) {
    const stageId = stMap.get(f.stage_number)
    if (!stageId) continue

    // check if it exists
    const { data: existing } = await supabase
      .from('workflow_fields')
      .select('id')
      .eq('workflow_id', wf.id)
      .eq('stage_id', stageId)
      .eq('field_key', f.field_key)
      .single()

    const payload = {
      workflow_id: wf.id,
      stage_id: stageId,
      field_key: f.field_key,
      field_label: f.field_label,
      data_type: f.data_type,
      is_required: f.is_required || false,
      is_readonly: f.is_readonly || false,
      is_hidden: f.is_hidden || false,
      display_order: f.display_order,
      configuration: f.configuration || {},
    }

    if (existing) {
      await supabase.from('workflow_fields').update(payload).eq('id', existing.id)
    } else {
      await supabase.from('workflow_fields').insert(payload)
    }
    console.log('Processed', f.field_key)
  }

  console.log('Migration complete.')
}

runMigration().catch(console.error)
