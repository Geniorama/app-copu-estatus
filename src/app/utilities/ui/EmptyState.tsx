import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox, faSearch, faDatabase, faUsers, faBuilding, faCog, faFileAlt } from "@fortawesome/free-solid-svg-icons";

interface EmptyStateProps {
  type?: 'default' | 'search' | 'companies' | 'services' | 'contents' | 'users' | 'data';
  title?: string;
  message?: string;
  showIcon?: boolean;
  className?: string;
}

const getIconAndMessage = (type: string) => {
  switch (type) {
    case 'search':
      return {
        icon: faSearch,
        title: 'No se encontraron resultados',
        message: 'Intenta con otros términos de búsqueda o ajusta los filtros aplicados.'
      };
    case 'companies':
      return {
        icon: faBuilding,
        title: 'No hay compañías disponibles',
        message: 'Aún no se han registrado compañías en el sistema. Comienza creando la primera.'
      };
    case 'services':
      return {
        icon: faCog,
        title: 'No hay servicios disponibles',
        message: 'Aún no se han registrado servicios en el sistema. Comienza creando el primero.'
      };
    case 'contents':
      return {
        icon: faFileAlt,
        title: 'No hay contenidos disponibles',
        message: 'Aún no se han registrado contenidos en el sistema. Comienza creando el primero.'
      };
    case 'users':
      return {
        icon: faUsers,
        title: 'No hay usuarios disponibles',
        message: 'Aún no se han registrado usuarios en el sistema. Comienza creando el primero.'
      };
    case 'data':
      return {
        icon: faDatabase,
        title: 'No hay datos disponibles',
        message: 'Aún no hay información en el sistema. Los datos aparecerán aquí una vez se registren.'
      };
    default:
      return {
        icon: faInbox,
        title: 'No hay contenido disponible',
        message: 'Aún no hay información en esta sección. Los datos aparecerán aquí una vez se registren.'
      };
  }
};

export default function EmptyState({ 
  type = 'default', 
  title, 
  message, 
  showIcon = true,
  className = '' 
}: EmptyStateProps) {
  const { icon, title: defaultTitle, message: defaultMessage } = getIconAndMessage(type);
  
  return (
    <div className={`text-center p-8 mt-10 flex flex-col justify-center items-center ${className}`}>
      {showIcon && (
        <div className="mb-4">
          <FontAwesomeIcon
            icon={icon}
            className="text-slate-400 text-6xl opacity-50"
          />
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-300 mb-2">
        {title || defaultTitle}
      </h3>
      <p className="text-slate-400 max-w-md leading-relaxed">
        {message || defaultMessage}
      </p>
    </div>
  );
}
