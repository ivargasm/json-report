import { useComponentsStore } from '../../store/componentsStore'

export default function ComponentGraphConfigurator({ componentId }: { componentId: string }) {
  const { components, updateComponent } = useComponentsStore()
  const graphTypes = ['graph_bar', 'graph_pie', 'graph_doughnut', 'graph_line', 'graph_mixed']
  const graph = components.find((c) => c.id === componentId && graphTypes.includes(c.type))
  
  if (!graph) return null

  const handleUpdate = (field: string, value: any) => {
    updateComponent(graph.id, { [field]: value })
  }

  const handleAlertUpdate = (field: string, value: string) => {
    const currentAlert = graph.alert || { schema: '', type: 'warning', message: '' }
    updateComponent(graph.id, { alert: { ...currentAlert, [field]: value } })
  }

  return (
    <div className="p-6 bg-light-contrast dark:bg-dark-contrast border border-gray-200 dark:border-dark-check text-text dark:text-text-dark rounded shadow mt-6 space-y-4">
      <h2 className="text-xl font-semibold text-text dark:text-text-dark ">Configurar {graph.type} ({graph.title})</h2>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Colores Aleatorios</label>
          <select 
            value={graph.random_colors || 'false'} 
            onChange={(e) => handleUpdate('random_colors', e.target.value)} 
            className="bg-[#2b2b3d] border border-gray-200 dark:border-dark-check p-2 rounded w-full"
          >
            <option value="false">Falso (Escala default)</option>
            <option value="true">Verdadero</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Datasource de Alerta</label>
          <input 
            type="text" 
            value={graph.datasource_alert || ''} 
            onChange={(e) => handleUpdate('datasource_alert', e.target.value)} 
            className="bg-bg dark:bg-bg-dark border border-gray-200 dark:border-dark-check p-2 rounded w-full" 
            placeholder="SELECT show_alert, mensaje FROM..." 
          />
        </div>
      </div>

      <div className="p-4 bg-light-check dark:bg-[#33334d] rounded border border-gray-700 mt-4 space-y-3">
        <h3 className="font-semibold text-orange-200">Configuración de Alerta (Opcional)</h3>
        <p className="text-xs text-gray-400">Si se definió un Datasource de Alerta, configura el mensaje y el tipo aquí.</p>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-1">Schema de Alerta</label>
            <input 
              type="text" 
              value={graph.alert?.schema || ''} 
              onChange={(e) => handleAlertUpdate('schema', e.target.value)} 
              className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-2 rounded w-full" 
              placeholder="ej: aux_project&projectId&" 
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Tipo de Alerta</label>
            <select 
              value={graph.alert?.type || 'warning'} 
              onChange={(e) => handleAlertUpdate('type', e.target.value)} 
              className="bg-[#2b2b3d] border border-gray-200 dark:border-dark-check p-2 rounded w-full"
            >
              <option value="warning">Warning</option>
              <option value="danger">Danger</option>
              <option value="info">Info</option>
              <option value="success">Success</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Mensaje de Alerta</label>
            <input 
              type="text" 
              value={graph.alert?.message || ''} 
              onChange={(e) => handleAlertUpdate('message', e.target.value)} 
              className="bg-light-contrast dark:bg-dark-contrast dark:border-dark-check border border-gray-200 dark:border-dark-check p-2 rounded w-full" 
              placeholder="Mensaje con &variable& interpolada" 
            />
          </div>
        </div>
      </div>
    </div>
  )
}
