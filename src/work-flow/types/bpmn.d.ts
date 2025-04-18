/**
 * BPMN引擎类型扩展声明
 * 适配bpmn-engine@23.0.2
 */
declare module 'bpmn-engine' {
  interface Activity {
    id: string
    type: string
    status: 'waiting' | 'active' | 'completed'
  }

  interface Instance {
    readonly id: string
    state: 'running' | 'paused' | 'completed' | 'terminated'
    getStateSnapshot: () => Readonly<object>
    resume: (snapshot?: object) => Promise<void>
    stop: () => Promise<void>
    execute: () => Promise<void>
    setVariables: (variables: Record<string, unknown>) => void
    getActivities: () => Activity[]
  }

  interface DefinitionOptions {
    variables?: Record<string, unknown>
    services?: Record<string, (...args: any[]) => Promise<void>>
  }

  interface Definition {
    getInstance: (options?: DefinitionOptions) => Promise<Instance>
  }

  interface Engine {
    define: (xml: string) => Promise<Definition>
    getExecutingInstances: () => Instance[]
    getStoppedInstances: () => Instance[]
  }
}
