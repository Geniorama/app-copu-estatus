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

  // Calcular totales para el gráfico de torta
  const totalContratadas = (service.accionWebYRss || 0) + (service.accionPostRss || 0);
  const totalUtilizadas = usedWebRss + usedPostRss;
  const totalRestantes = remainingWebRss + remainingPostRss;

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

  // Función para crear el gráfico de torta
  const createPieChart = () => {
    const radius = 50; // Reducido para móviles
    const centerX = 70;
    const centerY = 70;
    
    let currentAngle = -90; // Empezar desde arriba
    
    const segments = [
      { value: totalUtilizadas, color: "#3B82F6", label: "Utilizadas" },
      { value: totalRestantes, color: "#10B981", label: "Restantes" }
    ].filter(segment => segment.value > 0);

    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    
    if (total === 0) {
      return (
        <svg width="140" height="140" className="mx-auto">
          <circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="#374151"
            stroke="#6B7280"
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={centerY + 5}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize="14"
            fontWeight="500"
          >
            Sin datos
          </text>
        </svg>
      );
    }

    const paths = segments.map((segment, index) => {
      const percentage = segment.value / total;
      const angle = percentage * 360;
      const endAngle = currentAngle + angle;
      
      const x1 = centerX + radius * Math.cos((currentAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((currentAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);
      
      const largeArcFlag = angle > 180 ? 1 : 0;
      
      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');
      
      currentAngle = endAngle;
      
      return (
        <path
          key={index}
          d={pathData}
          fill={segment.color}
          stroke="#1F2937"
          strokeWidth="2"
        />
      );
    });

    return (
      <svg width="140" height="140" className="mx-auto">
        {paths}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius * 0.4}
          fill="#1F2937"
        />
        <text
          x={centerX}
          y={centerY - 6}
          textAnchor="middle"
          fill="#D1D5DB"
          fontSize="18"
          fontWeight="bold"
        >
          {totalContratadas}
        </text>
        <text
          x={centerX}
          y={centerY + 10}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize="12"
        >
          Total
        </text>
      </svg>
    );
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

      {/* Total General con Gráfico de Torta */}
      <div className="bg-slate-800 rounded-lg p-6 col-span-2">
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 mb-4">
          <div className="flex-1 w-full">
            <h3 className="text-lg font-semibold mb-4 text-center lg:text-left">Total General</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Contratadas:</span>
                <span className="text-slate-300 font-medium">{totalContratadas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Utilizadas:</span>
                <span className="text-slate-300 font-medium">{totalUtilizadas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Restantes:</span>
                <span className="text-slate-300 font-medium">{totalRestantes}</span>
              </div>
            </div>
          </div>
          
          {/* Gráfico de torta */}
          <div className="flex-shrink-0">
            {createPieChart()}
          </div>
        </div>
        
        {/* Leyenda del gráfico */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-4">
          <div className="flex items-center gap-2 justify-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-slate-400 text-sm">Utilizadas ({totalUtilizadas})</span>
          </div>
          <div className="flex items-center gap-2 justify-center">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-slate-400 text-sm">Restantes ({totalRestantes})</span>
          </div>
        </div>
      </div>
    </div>
  );
} 