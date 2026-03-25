import { useComponentsStore } from '../../store/componentsStore'

export default function ComponentProgressBarConfigurator({ componentId }: { componentId: string }) {
  const { components } = useComponentsStore()
  const progress = components.find((c) => c.id === componentId && c.type === 'progress_bar')

  if (!progress) return null

  return (
    <div className="p-6 bg-light-contrast dark:bg-dark-contrast border border-gray-200 dark:border-dark-check text-text dark:text-text-dark rounded shadow mt-6 space-y-2">
      <h2 className="text-xl font-semibold text-text dark:text-text-dark ">Configurar Progress Bar ({progress.title})</h2>
      <p className="text-sm text-gray-400">
        El componente Progress Bar no requiere configuración adicional a nivel de interfaz. 
        Asegúrate de que tu datasource retorne `percentage` (y opcionalmente `target_percentage` y `last_updated`).
      </p>
    </div>
  )
}
