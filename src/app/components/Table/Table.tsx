import type { TableDataProps } from "@/app/types";

interface TableProps {
  data: TableDataProps;
  className?: string;
}

export default function Table({ data, className }: TableProps) {
  if(!data || !data.rows){
    console.log('falta la data')
    return
  }

  return (
    <div className="w-full overflow-x-scroll custom-scroll">
      <table className={`w-full mt-4 text-slate-300 ${className || ""}`}>
        <thead className="text-slate-200 bg-gray-950">
          <tr>
            {data.heads.map((heading, i) => (
              <th key={i} className="p-4 uppercase text-sm text-left whitespace-nowrap">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr
              key={i}
              className={`${
                i % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
              } hover:outline outline-1 outline-cp-primary`}
            >
              {row.map((cell, j) => (
                <td key={j} className="p-4 text-sm text-left">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
