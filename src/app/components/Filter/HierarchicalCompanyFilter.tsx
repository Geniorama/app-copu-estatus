import { useState, useEffect } from 'react';
import type { Company } from '@/app/types';

interface HierarchicalCompanyFilterProps {
  companies: Company[];
  selectedCompanies: string[];
  onCompanySelect: (companyId: string) => void;
  onCompanyDeselect: (companyId: string) => void;
}

interface CompanyNode {
  id: string;
  name: string;
  children: CompanyNode[];
  isSelected: boolean;
  superiorId: string | null;
}

export default function HierarchicalCompanyFilter({
  companies,
  selectedCompanies,
  onCompanySelect,
  onCompanyDeselect,
}: HierarchicalCompanyFilterProps) {
  const [companyTree, setCompanyTree] = useState<CompanyNode[]>([]);

  useEffect(() => {
    // Construir el árbol de empresas
    const buildCompanyTree = () => {
      // Primero creamos un mapa de todas las empresas
      const companyMap = new Map<string, CompanyNode>();
      
      // Crear nodos para todas las empresas
      companies.forEach(company => {
        if (company.id && company.name) {
          companyMap.set(company.id, {
            id: company.id,
            name: company.name,
            children: [],
            isSelected: selectedCompanies.includes(company.id),
            superiorId: company.superiorId || null
          });
        }
      });

      // Construir el árbol
      const rootNodes: CompanyNode[] = [];
      
      // Primero agregamos todas las empresas que no tienen superior
      companies.forEach(company => {
        if (company.id && !company.superiorId) {
          const node = companyMap.get(company.id);
          if (node) {
            rootNodes.push(node);
          }
        }
      });

      // Luego agregamos las empresas que tienen superior
      companies.forEach(company => {
        if (company.id && company.superiorId) {
          const node = companyMap.get(company.id);
          const parentNode = companyMap.get(company.superiorId);
          
          if (node && parentNode) {
            parentNode.children.push(node);
          }
        }
      });

      // Ordenar los nodos por nombre
      const sortNodes = (nodes: CompanyNode[]): CompanyNode[] => {
        return nodes.sort((a, b) => a.name.localeCompare(b.name)).map(node => ({
          ...node,
          children: sortNodes(node.children)
        }));
      };

      return sortNodes(rootNodes);
    };

    setCompanyTree(buildCompanyTree());
  }, [companies, selectedCompanies]);

  const handleCompanyToggle = (companyId: string) => {
    const isSelected = selectedCompanies.includes(companyId);
    if (isSelected) {
      onCompanyDeselect(companyId);
    } else {
      onCompanySelect(companyId);
    }
  };

  const renderCompanyNode = (node: CompanyNode, level: number = 0) => {
    const isSelected = selectedCompanies.includes(node.id);
    const hasChildren = node.children.length > 0;
    
    return (
      <div key={node.id} className="w-full">
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-60 py-1"
          style={{ paddingLeft: `${level * 1.5}rem` }}
          onClick={() => handleCompanyToggle(node.id)}
        >
          <span
            className={`w-3 h-3 block border rounded-sm shadow-sm ${
              isSelected ? "bg-cp-primary border-cp-primary" : "border-slate-400"
            }`}
          />
          <span className="text-sm">{node.name}</span>
          {hasChildren && (
            <span className="text-xs text-slate-500 ml-1">
              ({node.children.length})
            </span>
          )}
        </div>
        {hasChildren && (
          <div className="w-full">
            {node.children.map(child => renderCompanyNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto custom-scroll">
      {companyTree.length > 0 ? (
        companyTree.map(node => renderCompanyNode(node))
      ) : (
        <div className="text-center text-slate-500 py-2">
          No hay empresas disponibles
        </div>
      )}
    </div>
  );
} 