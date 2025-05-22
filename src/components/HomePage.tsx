import { useNavigate } from 'react-router'

export default function HomePage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-bg dark:bg-bg-dark text-text dark:text-text-dark px-6 py-10 mx-auto">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-400 mb-6">
                    Generador de JSON para Reportes
                </h1>

                <p className="mb-6">
                    Esta aplicación te permite construir un JSON válido para configurar reportes,
                    incluyendo filtros, componentes tipo resumen y tablas.
                </p>

                <h2 className="text-xl font-semibold text-green-400 mb-4">
                    🧭 ¿Cómo usar la aplicación?
                </h2>

                <ol className="list-decimal pl-5 space-y-3">
                    <li>
                        <strong>Selecciona los filtros</strong> que formarán parte del reporte.
                        Si agregas filtros personalizados, se habilitarán formularios adicionales.
                    </li>
                    <li>
                        <strong>Agrega uno o dos componentes</strong>: un componente tipo <em>tabla</em> (obligatorio)
                        y opcionalmente uno tipo <em>resumen</em>.
                    </li>
                    <li>
                        <strong>Ingresa tu consulta SQL</strong> en cada componente y haz clic en
                        <em> Obtener columnas</em> para autocompletar los campos.
                    </li>
                    <li>
                        <strong>Configura visualmente</strong> las columnas, filas y atributos
                        de cada componente usando los selectores disponibles.
                    </li>
                    <li>
                        <strong>Vista previa y exportación</strong>: cuando hayas terminado, podrás ver el JSON final,
                        copiarlo o descargarlo.
                    </li>
                </ol>

                <div className="mt-10">
                    <button
                        onClick={() => navigate('/configurar-reporte')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded text-lg"
                    >
                        Empezar configuración →
                    </button>
                </div>

            </div>
        </div>
    )
}
