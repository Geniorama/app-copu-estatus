import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGlobe, faRss, faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import type { Service, Content } from "@/app/types";

interface ServiceActionsSummaryProps {
  service: Service;
  contents: Content[];
}

export default function ServiceActionsSummary({ service, contents }: ServiceActionsSummaryProps) {
  // Calcular acciones utilizadas
  const usedWebRss = contents.reduce((total, content) => {
    return total + (content.socialMediaInfo?.length || 0);
  }, 0);

  const usedPostRss = contents.length; // Cada contenido cuenta como una acción Post RSS

  // Calcular acciones restantes
  const remainingWebRss = (service.accionWebYRss || 0) - usedWebRss;
  const remainingPostRss = (service.accionPostRss || 0) - usedPostRss;

  // Determinar el estado de las acciones
  const getWebRssStatus = () => {
    if (remainingWebRss <= 0) return "agotado";
    if (remainingWebRss <= (service.accionWebYRss || 0) * 0.2) return "bajo";
    return "disponible";
  };

  const getPostRssStatus = () => {
    if (remainingPostRss <= 0) return "agotado";
    if (remainingPostRss <= (service.accionPostRss || 0) * 0.2) return "bajo";
    return "disponible";
  };

  const webRssStatus = getWebRssStatus();
  const postRssStatus = getPostRssStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "agotado":
        return "text-red-500";
      case "bajo":
        return "text-yellow-500";
      case "disponible":
        return "text-green-500";
      default:
        return "text-slate-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "agotado":
        return faExclamationTriangle;
      case "bajo":
        return faExclamationTriangle;
      case "disponible":
        return faCheckCircle;
      default:
        return faCheckCircle;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Acciones Web y RSS */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon icon={faGlobe} className="text-cp-primary text-xl" />
          <h3 className="text-lg font-semibold">Acciones Web y RSS</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Contratadas:</span>
            <span className="text-slate-300 font-medium">{service.accionWebYRss || 0}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Utilizadas:</span>
            <span className="text-slate-300 font-medium">{usedWebRss}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Restantes:</span>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon 
                icon={getStatusIcon(webRssStatus)} 
                className={`${getStatusColor(webRssStatus)} text-sm`} 
              />
              <span className={`font-medium ${getStatusColor(webRssStatus)}`}>
                {remainingWebRss}
              </span>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-cp-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((usedWebRss / (service.accionWebYRss || 1)) * 100, 100)}%` 
              }}
            ></div>
          </div>
          
          <div className="text-xs text-slate-500 text-center">
            {Math.round((usedWebRss / (service.accionWebYRss || 1)) * 100)}% utilizado
          </div>
        </div>
      </div>

      {/* Acciones Post RSS */}
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FontAwesomeIcon icon={faRss} className="text-cp-primary text-xl" />
          <h3 className="text-lg font-semibold">Acciones Post RSS</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Contratadas:</span>
            <span className="text-slate-300 font-medium">{service.accionPostRss || 0}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Utilizadas:</span>
            <span className="text-slate-300 font-medium">{usedPostRss}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Restantes:</span>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon 
                icon={getStatusIcon(postRssStatus)} 
                className={`${getStatusColor(postRssStatus)} text-sm`} 
              />
              <span className={`font-medium ${getStatusColor(postRssStatus)}`}>
                {remainingPostRss}
              </span>
            </div>
          </div>
          
          {/* Barra de progreso */}
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div 
              className="bg-cp-primary h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((usedPostRss / (service.accionPostRss || 1)) * 100, 100)}%` 
              }}
            ></div>
          </div>
          
          <div className="text-xs text-slate-500 text-center">
            {Math.round((usedPostRss / (service.accionPostRss || 1)) * 100)}% utilizado
          </div>
        </div>
      </div>
    </div>
  );
} 