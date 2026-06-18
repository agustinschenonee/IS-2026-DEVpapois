import { useState } from "react";
import { useAppContext } from "../context/AppContext";
import { format, parseISO, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  XCircle, 
  AlertTriangle 
} from "lucide-react";

import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Reservations() {
  const { reservations, resources, cancelReservation } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled'>('all');
  const [showConfirmCancel, setShowConfirmCancel] = useState<string | null>(null);

  // Sorting reservations by date and time (newest first)
  const sortedReservations = [...reservations].sort((a, b) => {
    return new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime();
  });

  const filteredReservations = sortedReservations.filter(res => filter === 'all' || res.status === filter);

  const handleCancel = async (id: string) => {
    await cancelReservation(id);
    setShowConfirmCancel(null);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Mis Reservas</h1>
          <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">Administra tus espacios de trabajo y salas de reuniones.</p>
        </div>
        
        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          {(['all', 'active', 'cancelled'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                filter === f 
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {f === 'all' ? 'Todas' : f === 'active' ? 'Activas' : 'Canceladas'}
            </button>
          ))}
        </div>
      </div>

      {filteredReservations.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <CalendarDays className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">No se encontraron reservas</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">No tienes reservas {filter !== 'all' ? `con estado "${filter}"` : 'todavía'}.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredReservations.map(res => {
            const resource = resources.find(r => r.id === res.resourceId);
            const isPast = !isAfter(new Date(`${res.date}T${res.endTime}`), new Date());
            
            return (
              <div 
                key={res.id} 
                className={`bg-white dark:bg-gray-900 rounded-2xl shadow-sm border p-6 transition-all
                  ${res.status === 'cancelled' ? 'border-gray-200 dark:border-gray-800 opacity-60' : 'border-emerald-100 dark:border-emerald-900/50 hover:shadow-md'}`}
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 ${
                      res.status === 'cancelled' ? 'opacity-50 grayscale' : ''
                    }`}>
                      <ImageWithFallback 
                        src={resource?.imageUrl || ''} 
                        alt={resource?.name || 'Espacio'} 
                        className="w-full h-full object-cover bg-gray-100 dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className={`text-xl font-bold ${res.status === 'cancelled' ? 'text-gray-600 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {resource?.name || 'Recurso Eliminado'}
                        </h3>
                        {res.status === 'active' && !isPast && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                            Próxima
                          </span>
                        )}
                        {res.status === 'active' && isPast && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Completada
                          </span>
                        )}
                        {res.status === 'cancelled' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Cancelada
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CalendarDays size={16} className={res.status === 'active' ? 'text-emerald-500' : ''} />
                          {format(parseISO(res.date), "EEEE, d 'de' MMMM, yyyy", { locale: es })}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock size={16} className={res.status === 'active' ? 'text-emerald-500' : ''} />
                          {res.startTime} - {res.endTime}
                        </span>
                      </div>
                      {res.notes && (
                        <div className="mt-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg text-sm text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700">
                          <span className="font-bold text-gray-700 dark:text-gray-200 block mb-1">Notas:</span>
                          {res.notes}
                        </div>
                      )}
                    </div>
                  </div>

                  {res.status === 'active' && !isPast && (
                    <div className="flex flex-col md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100 dark:border-gray-800 mt-4 md:mt-0">
                      {showConfirmCancel === res.id ? (
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/50 animate-in fade-in flex flex-col items-end gap-3 w-full md:w-auto">
                          <span className="text-sm text-red-800 dark:text-red-300 font-bold flex items-center gap-2">
                            <AlertTriangle size={16} /> ¿Seguro que deseas cancelar?
                          </span>
                          <div className="flex gap-2 w-full md:w-auto">
                            <button 
                              onClick={() => setShowConfirmCancel(null)}
                              className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              Mantener
                            </button>
                            <button 
                              onClick={() => handleCancel(res.id)}
                              className="flex-1 md:flex-none px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors"
                            >
                              Sí, cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setShowConfirmCancel(res.id)}
                          className="flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-red-200 dark:border-red-900/50 text-sm font-bold rounded-xl text-red-600 dark:text-red-400 bg-white dark:bg-gray-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full md:w-auto shadow-sm"
                        >
                          <XCircle size={18} />
                          Cancelar Reserva
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
