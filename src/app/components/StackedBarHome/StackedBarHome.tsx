import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
    <div className="w-full h-full">
      <BarChart
        width={700}
        height={300}
        data={data}
        margin={{
          top: 50,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="alcance" stackId="a" fill="#FFA806" />
        <Bar dataKey="impresiones" stackId="a" fill="#815AFF" />
        <Bar dataKey="interacciones" stackId="a" fill="#EF3E24" />
        <Bar dataKey="contenidos" stackId="a" fill="#0102FF" />
      </BarChart>
    </div>
  );
}
