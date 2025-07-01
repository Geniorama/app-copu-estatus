import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumber } from "@/app/utilities/helpers/formatters";
import type { Content } from "@/app/types";

interface ServiceStatsChartProps {
  contents: Content[];
}

export default function ServiceStatsChart({ contents }: ServiceStatsChartProps) {
  // Calcular totales de estadísticas
  const totalStats = contents.reduce(
    (acc, content) => {
      acc.alcance += content.scope || 0;
      acc.impresiones += content.impressions || 0;
      acc.interacciones += content.interactions || 0;
      return acc;
    },
    { alcance: 0, impresiones: 0, interacciones: 0 }
  );

  // Preparar datos para la gráfica
  const chartData = [
    {
      name: "Alcance",
      valor: totalStats.alcance,
      color: "#3B82F6",
    },
    {
      name: "Impresiones",
      valor: totalStats.impresiones,
      color: "#10B981",
    },
    {
      name: "Interacciones",
      valor: totalStats.interacciones,
      color: "#F59E0B",
    },
  ];

  return (
    <div className="w-full h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
          barGap={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={14}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12}
            tickFormatter={(value) => formatNumber(value)}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB',
              fontSize: '12px'
            }}
            formatter={(value: number) => [formatNumber(value), 'Total']}
            labelFormatter={(label) => `${label}`}
          />
          <Bar 
            dataKey="valor" 
            fill="#3B82F6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 