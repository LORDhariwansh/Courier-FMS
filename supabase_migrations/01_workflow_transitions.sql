-- Create workflow_transitions table
CREATE TABLE IF NOT EXISTS public.workflow_transitions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
    from_stage_id UUID NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
    to_stage_id UUID NOT NULL REFERENCES public.workflow_stages(id) ON DELETE CASCADE,
    action_name TEXT NOT NULL,
    condition_config JSONB DEFAULT '{"operator": "AND", "rules": []}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add completion_mode to workflow_stages
ALTER TABLE public.workflow_stages ADD COLUMN IF NOT EXISTS completion_mode TEXT DEFAULT 'manual';

-- Create fms_events (Milestone/Audit Engine)
CREATE TABLE IF NOT EXISTS public.fms_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    record_id UUID NOT NULL REFERENCES public.fms_records(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES public.workflow_stages(id) ON DELETE SET NULL,
    event_type TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT now(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'
);

-- Create notification_logs
CREATE TABLE IF NOT EXISTS public.notification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    record_id UUID NOT NULL REFERENCES public.fms_records(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES public.workflow_stages(id) ON DELETE SET NULL,
    recipient_email TEXT,
    channel TEXT,
    sent_at TIMESTAMPTZ DEFAULT now(),
    status TEXT
);

-- Enable RLS
ALTER TABLE public.workflow_transitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fms_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Update these based on your security needs)
CREATE POLICY "Allow read for authenticated users" ON public.workflow_transitions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.fms_events FOR ALL TO authenticated USING (true);
CREATE POLICY "Allow all for authenticated users" ON public.notification_logs FOR ALL TO authenticated USING (true);

-- Create secure transition RPC Function (Atomic Transaction)
CREATE OR REPLACE FUNCTION public.transition_record(
    p_record_id UUID,
    p_to_stage_id UUID,
    p_user_id UUID,
    p_metadata JSONB,
    p_event_type TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_stage_id UUID;
    v_record RECORD;
BEGIN
    -- 1. Lock the record for update to prevent race conditions
    SELECT * INTO v_record FROM public.fms_records WHERE id = p_record_id FOR UPDATE;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record not found';
    END IF;

    -- 2. Update the record
    UPDATE public.fms_records
    SET 
        current_stage_id = p_to_stage_id,
        metadata = p_metadata,
        updated_at = now()
    WHERE id = p_record_id;

    -- 3. Log the event atomically
    INSERT INTO public.fms_events (record_id, stage_id, event_type, timestamp, user_id, metadata)
    VALUES (p_record_id, p_to_stage_id, p_event_type, now(), p_user_id, p_metadata);

    RETURN jsonb_build_object('success', true);
END;
$$;
