# Generador de Estructura JSON para Reportes

Esta aplicación permite crear y configurar la estructura JSON necesaria para la generación de reportes personalizados. Proporciona una interfaz intuitiva para definir componentes, filtros y configuraciones específicas que se traducen en un esquema JSON listo para ser consumido por sistemas de generación de reportes.

## Características

- Interfaz gráfica para configurar la estructura del reporte
- Vista previa en tiempo real del JSON generado
- Soporte para múltiples componentes y configuraciones
- Filtros personalizables
- Exportación del esquema JSON

## Tecnologías Utilizadas

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Zustand (para gestión de estado)

## Instalación

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abre tu navegador en `http://localhost:5173`

## Uso

1. Configura los componentes principales del reporte
2. Añade y personaliza los filtros necesarios
3. Revisa la vista previa del JSON generado
4. Copia o exporta el JSON para su uso en tu sistema de reportes

## Estructura del Proyecto

```
src/
├── components/           # Componentes organizados por categoría
│   ├── ui/              # Componentes de interfaz reutilizables
│   ├── pages/           # Componentes de páginas principales
│   ├── forms/           # Componentes de formularios
│   ├── configurators/   # Componentes configuradores específicos
│   └── index.ts         # Exportaciones centralizadas
├── store/               # Gestión de estado con Zustand
├── types/               # Definiciones de tipos TypeScript organizadas
│   ├── common.ts        # Tipos comunes
│   ├── components.ts    # Tipos de componentes
│   ├── filters.ts       # Tipos de filtros
│   ├── stores.ts        # Tipos de stores
│   └── index.ts         # Re-exportaciones
├── constants/           # Constantes de la aplicación
├── config/              # Configuración centralizada
├── utils/               # Funciones utilitarias
├── hooks/               # Hooks personalizados
└── assets/              # Recursos estáticos
```


