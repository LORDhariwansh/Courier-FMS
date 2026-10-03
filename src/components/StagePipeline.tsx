import { ChevronRight } from 'lucide-react'

export interface StageInfo {
  number: number
  name: string
  tat?: number
  desc?: string
}

interface StagePipelineProps {
  stages: StageInfo[]
  selectedStage: number | null
  onSelectStage: (stageNumber: number | null) => void
  stageCounts: Record<number, number>
}

export function StagePipeline({
  stages,
  selectedStage,
  onSelectStage,
  stageCounts,
}: StagePipelineProps) {
  const totalRecords = Object.values(stageCounts).reduce((a, b) => a + b, 0)

  return (
    <div className="pipeline-wrapper">
      <div className="pipeline-header">
        <div>
          <h3>Workflow Progression Pipeline</h3>
          <p>Click any stage below to filter records, or view overall flow throughput.</p>
        </div>
        <button
          className={`all-filter-btn ${selectedStage === null ? 'active' : ''}`}
          onClick={() => onSelectStage(null)}
        >
          <span>All Stages</span>
          <span className="count-tag">{totalRecords}</span>
        </button>
      </div>

      <div className="pipeline-stepper">
        {stages.map((stage, idx) => {
          const count = stageCounts[stage.number] || 0
          const isSelected = selectedStage === stage.number

          return (
            <div key={stage.number} className="stepper-item-wrap">
              <button
                className={`stepper-node ${isSelected ? 'selected' : ''} ${count > 0 ? 'has-records' : ''}`}
                onClick={() => onSelectStage(isSelected ? null : stage.number)}
              >
                <div className="node-top">
                  <span className="stage-num-badge">Stage {stage.number}</span>
                  {stage.tat && <span className="tat-badge">TAT: {stage.tat}h</span>}
                </div>
                <div className="node-name">{stage.name}</div>
                <div className="node-footer">
                  <span className="node-count">{count} active</span>
                </div>
              </button>
              {idx < stages.length - 1 && (
                <div className="stepper-arrow">
                  <ChevronRight size={16} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
