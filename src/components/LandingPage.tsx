
import { useNavigate } from 'react-router';
import { BarChart, Table, Filter } from 'lucide-react';

export default function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-bg text-text dark:bg-bg-dark dark:text-text-dark">
            {/* Hero Section */}
            <section className="text-center py-20 px-4">
                <h1 className="text-5xl font-bold mb-4">Crea Reportes Dinámicos con Facilidad</h1>
                <p className="text-xl mb-8">Transforma tus datos en reportes JSON configurables de manera visual e intuitiva.</p>
                <button
                    onClick={() => navigate('/configurar-reporte')}
                    className="cursor-pointer bg-btn hover:opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 dark:bg-btn-dark"
                >
                    Empezar a Configurar
                </button>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-light-contrast dark:bg-dark-contrast">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">Características Principales</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 bg-white rounded-lg dark:bg-dark-check">
                            <Filter className="mx-auto mb-4 w-12 h-12 text-primary dark:text-primary-dark" />
                            <h3 className="text-xl font-bold mb-2">Filtros Personalizables</h3>
                            <p>Añade y configura filtros para tus reportes con total flexibilidad.</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg dark:bg-dark-check">
                            <Table className="mx-auto mb-4 w-12 h-12 text-secondary dark:text-secondary-dark" />
                            <h3 className="text-xl font-bold mb-2">Tablas Configurables</h3>
                            <p>Define las columnas y la estructura de tus tablas a partir de consultas SQL.</p>
                        </div>
                        <div className="p-6 bg-white rounded-lg dark:bg-dark-check">
                            <BarChart className="mx-auto mb-4 w-12 h-12 text-accent dark:text-accent-dark" />
                            <h3 className="text-xl font-bold mb-2">Componentes de Resumen</h3>
                            <p>Agrega tarjetas de resumen para visualizar los datos más importantes.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How it Works Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">¿Cómo Funciona?</h2>
                    <div className="max-w-3xl mx-auto">
                        <ol className="list-decimal list-inside space-y-4 text-lg">
                            <li>
                                <strong>Selecciona los filtros</strong> que formarán parte del reporte.
                            </li>
                            <li>
                                <strong>Agrega componentes</strong> como tablas y resúmenes.
                            </li>
                            <li>
                                <strong>Ingresa tu consulta SQL</strong> y obtén las columnas automáticamente.
                            </li>
                            <li>
                                <strong>Configura visualmente</strong> los componentes y sus atributos.
                            </li>
                            <li>
                                <strong>Obtén el JSON</strong> final y úsalo en tus reportes.
                            </li>
                        </ol>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-light-contrast dark:bg-dark-contrast text-center">
                <h2 className="text-3xl font-bold mb-4">¿Listo para empezar?</h2>
                <p className="text-xl mb-8">Crea tu primer reporte JSON en minutos.</p>
                <button
                    onClick={() => navigate('/configurar-reporte')}
                    className="cursor-pointer bg-secondary hover:opacity-90 text-white font-bold py-3 px-8 rounded-full text-lg transition-transform transform hover:scale-105 dark:bg-secondary-dark"
                >
                    Ir al Configurador
                </button>
            </section>
        </div>
    );
}
