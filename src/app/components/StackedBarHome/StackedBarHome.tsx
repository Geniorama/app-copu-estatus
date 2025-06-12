import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  {
    name: "Compañía A",
    alcance: 4000,
    impresiones: 2400,
    interacciones: 2400,
    contenidos: 1000,
  },
  {
    name: "Compañía B",
    alcance: 3000,
    impresiones: 1398,
    interacciones: 2210,
    contenidos: 1000,
  },
  {
    name: "Compañía C",
    alcance: 2000,
    impresiones: 9800,
    interacciones: 2290,
    contenidos: 1000,
  },
  {
    name: "Compañía D",
    alcance: 2780,
    impresiones: 3908,
    interacciones: 2000,
    contenidos: 1000,
  }
];

export default function StackedBarHome() {
  return (
    <div className="w-full h-[300px] md:h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 40,
            right: 10,
            left: 10,
            bottom: 20,
          }}
          barGap={4}
          barCategoryGap={12}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF" 
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12}
            width={40}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F9FAFB',
              fontSize: '12px'
            }}
          />
          <Legend 
            wrapperStyle={{
              color: '#F9FAFB',
              fontSize: '12px',
              paddingTop: '0px',
              marginBottom: '10px',
              paddingBottom: '30px'
            }}
            layout="horizontal"
            verticalAlign="top"
            align="center"
          />
          <Bar 
            dataKey="alcance" 
            fill="#3B82F6"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="impresiones" 
            fill="#10B981"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="interacciones" 
            fill="#F59E0B"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="contenidos" 
            fill="#8B5CF6"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
