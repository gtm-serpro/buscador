// src/components/results/ResultsTable/TableHeader.tsx

export default function TableHeader() {
  return (
    <thead className="bg-gray-50 border-b">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Título
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Processo
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Tipo Processo
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Contribuinte
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Data Juntada
        </th>
        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
          Situação
        </th>
      </tr>
    </thead>
  );
}