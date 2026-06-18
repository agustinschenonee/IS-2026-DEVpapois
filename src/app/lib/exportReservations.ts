import * as XLSX from 'xlsx';
import type { Resource, Reservation } from '../context/AppContext';

export function exportToExcel(
  reservations: Reservation[],
  resources: Resource[],
  userMap: Record<string, string>
) {
  const rows = reservations.map(r => ({
    Fecha: r.date,
    Usuario: userMap[r.userId ?? ''] ?? r.userId ?? '-',
    Recurso: resources.find(rc => rc.id === r.resourceId)?.name ?? r.resourceId,
    'Hora Inicio': r.startTime,
    Estado: r.status === 'active' ? 'Confirmado' : 'Cancelado',
  }));

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Reservas');
  XLSX.writeFile(wb, `reservas_devpapois_${new Date().toISOString().slice(0, 10)}.xlsx`);
}