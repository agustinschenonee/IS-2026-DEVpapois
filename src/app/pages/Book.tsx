import { useState } from "react";
import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "react-day-picker/dist/style.css";
import { 
  ChevronRight, 
  ChevronLeft, 
  Monitor, 
  Users, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2,
  Wifi,
  Tv,
  Coffee,
  Info,
  MapPin,
  PartyPopper
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

const TIME_SLOTS = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export function BookingWizard() {
  const navigate = useNavigate();
  const { resources, reservations, blocks, addReservation } = useAppContext();

  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedType, setSelectedType] = useState<"room" | "desk" | null>(null);
  const [capacityFilter, setCapacityFilter] = useState<number>(1);
  const [selectedResource, setSelectedResource] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceed = () => {
    if (step === 1) return !!selectedDate;
    if (step === 2) return !!selectedType;
    if (step === 3) return selectedSlots.length > 0 && !!selectedResource;
    return true;
  };

  const handleNext = () => {
    if (canProceed() && step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const isSlotAvailable = (resourceId: string, time: string, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const now = new Date();
    const todayStr = format(now, "yyyy-MM-dd");
    if (dateStr === todayStr) {
      const currentHour = now.getHours();
      const slotHour = parseInt(time.split(':')[0], 10);
      if (slotHour <= currentHour) return false;
    }
    const isBlocked = blocks.some(b => b.date === dateStr && (b.resourceId === 'all' || b.resourceId === resourceId));
    if (isBlocked) return false;
    const isReserved = reservations.some(r => {
      if (r.status !== 'active' || r.date !== dateStr || r.resourceId !== resourceId) return false;
      const resStart = parseInt(r.startTime.split(':')[0], 10);
      const resEnd = parseInt(r.endTime.split(':')[0], 10);
      const slotHour = parseInt(time.split(':')[0], 10);
      return slotHour >= resStart && slotHour < resEnd;
    });
    return !isReserved;
  };

  const toggleSlot = (resourceId: string, time: string) => {
    if (selectedResource !== resourceId) {
      setSelectedResource(resourceId);
      setSelectedSlots([time]);
    } else {
      if (selectedSlots.includes(time)) {
        setSelectedSlots(selectedSlots.filter(t => t !== time));
      } else {
        setSelectedSlots([...selectedSlots, time].sort());
      }
    }
  };

  const handleConfirm = async () => {
    if (!selectedResource || selectedSlots.length === 0 || !selectedDate) return;
    setBookingError("");
    setIsSubmitting(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const sortedSlots = [...selectedSlots].sort();
    const startTime = sortedSlots[0];
    const endHour = parseInt(sortedSlots[sortedSlots.length - 1].split(':')[0], 10) + 1;
    const endTime = `${String(endHour).padStart(2, '0')}:00`;

    const result = await addReservation({
      resourceId: selectedResource,
      date: dateStr,
      startTime,
      endTime,
      notes,
    });

    setIsSubmitting(false);
    if (result && !result.success) {
      setBookingError(result.error ?? "No se pudo completar la reserva.");
      return;
    }
    setIsSuccess(true);
  };

  const availableResources = resources.filter(r => 
    r.type === selectedType && 
    r.isActive && 
    r.capacity >= capacityFilter
  );

  const selectedResourceDetails = resources.find(r => r.id === selectedResource);

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 animate-in fade-in zoom-in duration-500">
        <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-emerald-50 dark:from-emerald-900/20 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <PartyPopper className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">¡Reserva confirmada!</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 max-w-md">
              Tu espacio en DevPapois está listo. Te enviamos un correo con los detalles.
            </p>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl w-full p-6 mb-8 text-left border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-lg border-b border-gray-200 dark:border-gray-700 pb-2">Resumen de tu reserva</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <MapPin className="text-emerald-500 w-5 h-5" />
                  <span className="font-medium">{selectedResourceDetails?.name}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <CalendarIcon className="text-emerald-500 w-5 h-5" />
                  <span className="font-medium capitalize">{selectedDate && format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Clock className="text-emerald-500 w-5 h-5" />
                  <span className="font-medium">
                    {selectedSlots.length > 0 && `${selectedSlots[0]} a ${(parseInt(selectedSlots[selectedSlots.length - 1].split(':')[0], 10) + 1).toString().padStart(2, '0')}:00`}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate("/reservations")}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Ver Mis Reservas
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 transition-colors duration-300">
      <div className="flex-1 min-w-0">
        {/* Stepper */}
        <div className="mb-10 bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Hacer una Reserva</h1>
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-100 dark:bg-gray-800 rounded"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-emerald-500 rounded transition-all duration-500 ease-out" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
            {[1, 2, 3, 4].map((s) => {
              const labels = ["Día", "Espacio", "Horario", "Confirmar"];
              return (
                <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                  <button
                    onClick={() => step > s && setStep(s)}
                    disabled={step < s}
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-4 font-bold text-sm transition-all duration-300 outline-none
                      ${step === s ? 'bg-emerald-500 border-white dark:border-gray-900 text-white shadow-md scale-110' :
                        step > s ? 'bg-emerald-500 border-emerald-200 dark:border-emerald-900/50 text-white cursor-pointer hover:bg-emerald-600' :
                        'bg-gray-100 dark:bg-gray-800 border-white dark:border-gray-900 text-gray-400 cursor-not-allowed'}`}
                  >
                    {step > s ? <CheckCircle2 className="w-5 h-5 text-white" /> : s}
                  </button>
                  <span className={`text-xs font-semibold hidden sm:block ${step >= s ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    {labels[s - 1]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 min-h-[450px] transition-colors relative">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4 flex items-center gap-2">
                Paso 1 <ChevronRight className="w-4 h-4" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">¿Qué día necesitas venir?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-md text-lg">Seleccioná la fecha en el calendario. Puedes reservar hasta con 30 días de anticipación.</p>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 md:p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-inner flex justify-center w-full max-w-md">
                <style>{`
                  .rdp { --rdp-cell-size: 44px; --rdp-accent-color: #059669; --rdp-background-color: #d1fae5; margin: 0; }
                  @media (min-width: 640px) { .rdp { --rdp-cell-size: 48px; } }
                  .dark .rdp { --rdp-accent-color: #10b981; --rdp-background-color: rgba(16, 185, 129, 0.2); }
                  .rdp-day_selected { background-color: var(--rdp-accent-color) !important; color: white !important; font-weight: 700; transform: scale(1.1); box-shadow: 0 4px 14px rgba(5, 150, 105, 0.35); border-radius: 9999px; }
                  .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: var(--rdp-background-color); color: #047857; border-radius: 9999px; }
                  .dark .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { color: #34d399; }
                  .rdp-day { transition: all 0.2s ease; border-radius: 9999px; color: #374151; font-weight: 500; }
                  .dark .rdp-day { color: #d1d5db; }
                  .rdp-day_disabled { opacity: 0.3; cursor: not-allowed; }
                  .rdp-head_cell { text-transform: capitalize; font-weight: 600; color: #6b7280; font-size: 0.875rem; }
                  .dark .rdp-head_cell { color: #9ca3af; }
                  .rdp-nav_button { color: #059669; }
                  .dark .rdp-nav_button { color: #10b981; }
                  .rdp-caption_label { font-weight: 800; color: #111827; text-transform: capitalize; font-size: 1.25rem; }
                  .dark .rdp-caption_label { color: #f9fafb; }
                `}</style>
                <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  required
                  locale={es}
                  disabled={[{ before: new Date() }]}
                  className="bg-white dark:bg-gray-900 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800"
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4 flex items-center gap-2">
                Paso 2 <ChevronRight className="w-4 h-4" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">¿Qué tipo de espacio buscas?</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-xl mx-auto text-lg">Elegí la opción que mejor se adapte a tu dinámica de trabajo de hoy.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto mb-8">
                <button
                  onClick={() => setSelectedType("desk")}
                  className={`p-6 md:p-8 rounded-[2rem] border-2 flex flex-col items-center justify-center transition-all duration-300 group outline-none focus:ring-4 focus:ring-emerald-500/20
                    ${selectedType === "desk"
                      ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10 shadow-lg scale-[1.02]"
                      : "border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <div className={`p-5 rounded-2xl mb-5 transition-colors duration-300 ${selectedType === "desk" ? "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 group-hover:text-emerald-500"}`}>
                    <Monitor size={56} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Escritorio Flex</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">Puestos individuales en zonas compartidas, ideales para enfocarse.</p>
                  <div className={`mt-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedType === "desk" ? "border-emerald-500 bg-emerald-500" : "border-gray-300 dark:border-gray-600"}`}>
                    {selectedType === "desk" && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />}
                  </div>
                </button>

                <button
                  onClick={() => setSelectedType("room")}
                  className={`p-6 md:p-8 rounded-[2rem] border-2 flex flex-col items-center justify-center transition-all duration-300 group outline-none focus:ring-4 focus:ring-blue-500/20
                    ${selectedType === "room"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 shadow-lg scale-[1.02]"
                      : "border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    }`}
                >
                  <div className={`p-5 rounded-2xl mb-5 transition-colors duration-300 ${selectedType === "room" ? "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-500"}`}>
                    <Users size={56} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sala Privada</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-3">Salas cerradas para videollamadas importantes o reuniones de equipo.</p>
                  <div className={`mt-4 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedType === "room" ? "border-blue-500 bg-blue-500" : "border-gray-300 dark:border-gray-600"}`}>
                    {selectedType === "room" && <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />}
                  </div>
                </button>
              </div>

              {selectedType === "room" && (
                <div className="w-full max-w-md mx-auto animate-in fade-in zoom-in duration-300 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex items-center justify-between gap-4">
                  <label className="text-base font-bold text-gray-900 dark:text-white">Capacidad requerida</label>
                  <div className="flex items-center gap-4 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-full border border-gray-200 dark:border-gray-700">
                    <button onClick={() => setCapacityFilter(Math.max(1, capacityFilter - 1))} className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">-</button>
                    <span className="text-xl font-black text-gray-900 dark:text-white w-8 text-center">{capacityFilter}</span>
                    <button onClick={() => setCapacityFilter(capacityFilter + 1)} className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-gray-900 dark:text-white font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">+</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex flex-col items-center mb-8">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold mb-4 flex items-center gap-2">
                  Paso 3 <ChevronRight className="w-4 h-4" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">Selecciona un Horario</h2>
                <p className="text-gray-500 dark:text-gray-400 text-center">
                  Mostrando espacios para {selectedDate && <strong className="text-gray-900 dark:text-white capitalize">{format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}</strong>}.
                </p>
              </div>

              {availableResources.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
                  <Info className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No encontramos espacios con estos filtros</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">Intenta reducir la capacidad requerida o cambiar de fecha para ver más opciones disponibles.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8 max-h-[600px] overflow-y-auto pr-2">
                  {availableResources.map(resource => {
                    const isResourceSelected = selectedResource === resource.id;
                    return (
                      <div
                        key={resource.id}
                        className={`flex flex-col md:flex-row bg-white dark:bg-gray-900 border-2 rounded-[2rem] overflow-hidden transition-all duration-300 cursor-pointer
                          ${isResourceSelected ? 'border-emerald-500 shadow-lg ring-4 ring-emerald-500/10' : 'border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-md'}`}
                        onClick={() => {
                          if (!isResourceSelected) {
                            setSelectedResource(resource.id);
                            setSelectedSlots([]);
                          }
                        }}
                      >
                        <div className="relative md:w-64 h-48 md:h-auto shrink-0 bg-gray-200 dark:bg-gray-800">
                          {resource.imageUrl ? (
                            <ImageWithFallback src={resource.imageUrl} alt={resource.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400"><Monitor size={48} /></div>
                          )}
                          <div className="absolute top-4 left-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 shadow-sm">
                            <Users size={14} className={resource.type === 'room' ? 'text-blue-600' : 'text-emerald-600'} />
                            Hasta {resource.capacity}
                          </div>
                        </div>

                        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center min-w-0">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white truncate">{resource.name}</h3>
                            {isResourceSelected && (
                              <div className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 p-1.5 rounded-full shrink-0 ml-2">
                                <CheckCircle2 size={20} />
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 mb-4">{resource.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {resource.amenities?.map((amenity, i) => (
                              <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-medium">
                                {amenity.toLowerCase().includes('wifi') && <Wifi size={14} className="mr-1.5 text-gray-400" />}
                                {amenity.toLowerCase().includes('tv') && <Tv size={14} className="mr-1.5 text-gray-400" />}
                                {amenity.toLowerCase().includes('caf') && <Coffee size={14} className="mr-1.5 text-gray-400" />}
                                {amenity}
                              </span>
                            ))}
                          </div>

                          {isResourceSelected && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300 pt-4 border-t border-gray-100 dark:border-gray-800">
                              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-between">
                                Selecciona las horas
                                {selectedSlots.length > 0 && (
                                  <span className="text-xs bg-emerald-500 text-white px-2 py-1 rounded-md animate-pulse">
                                    {selectedSlots.length} horas
                                  </span>
                                )}
                              </h4>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {TIME_SLOTS.map(time => {
                                  const isAvailable = isSlotAvailable(resource.id, time, selectedDate!);
                                  const isSelected = isResourceSelected && selectedSlots.includes(time);
                                  return (
                                    <button
                                      key={`${resource.id}-${time}`}
                                      disabled={!isAvailable}
                                      onClick={(e) => { e.stopPropagation(); toggleSlot(resource.id, time); }}
                                      className={`py-2 px-1 rounded-xl text-sm font-bold transition-all relative overflow-hidden outline-none focus:ring-2 focus:ring-emerald-500
                                        ${!isAvailable
                                          ? 'bg-gray-100 dark:bg-gray-800/30 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-800 cursor-not-allowed'
                                          : isSelected
                                            ? 'bg-emerald-600 text-white shadow-md border border-emerald-700 scale-105 z-10'
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-emerald-400 dark:hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:shadow-sm'
                                        }`}
                                    >
                                      {!isAvailable && (
                                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                          <div className="w-full h-px bg-gray-300 dark:bg-gray-700 rotate-45 absolute"></div>
                                        </div>
                                      )}
                                      {time}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="animate-in fade-in zoom-in duration-300 max-w-xl mx-auto flex flex-col items-center">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 px-4 py-1.5 rounded-full text-sm font-bold mb-6 flex items-center gap-2">
                Paso 4 <ChevronRight className="w-4 h-4" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">Confirmación final</h2>
              <p className="text-gray-500 dark:text-gray-400 mb-10 text-center text-lg">Revisá tu selección para confirmar la reserva.</p>

              <div className="w-full bg-white dark:bg-gray-900 border-2 border-emerald-100 dark:border-emerald-900/50 rounded-[2rem] p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center gap-5 border-b border-gray-100 dark:border-gray-800 pb-6 mb-6">
                  <div className="h-20 w-20 bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden shrink-0 shadow-inner">
                    <ImageWithFallback src={selectedResourceDetails?.imageUrl || ''} alt="Espacio" className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <span className="inline-block px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg text-xs font-bold uppercase tracking-wider mb-2">
                      {selectedResourceDetails?.type === 'room' ? 'Sala Privada' : 'Espacio Flex'}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white leading-none truncate">{selectedResourceDetails?.name}</h3>
                  </div>
                </div>

                <dl className="space-y-4 md:space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 gap-2">
                    <dt className="flex items-center text-gray-600 dark:text-gray-400 font-semibold">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center mr-4">
                        <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      Fecha
                    </dt>
                    <dd className="text-gray-900 dark:text-white font-bold capitalize text-lg sm:text-right ml-14 sm:ml-0">
                      {selectedDate && format(selectedDate, "d 'de' MMMM", { locale: es })}
                    </dd>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 gap-2">
                    <dt className="flex items-center text-gray-600 dark:text-gray-400 font-semibold">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center mr-4">
                        <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      Horario
                    </dt>
                    <dd className="text-gray-900 dark:text-white font-bold sm:text-right text-lg ml-14 sm:ml-0 flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                      {selectedSlots.length > 0 && `${selectedSlots[0]} - ${(parseInt(selectedSlots[selectedSlots.length - 1].split(':')[0], 10) + 1).toString().padStart(2, '0')}:00`}
                      <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/30 inline-block px-2 py-0.5 rounded-md mt-0.5">
                        {selectedSlots.length} horas
                      </div>
                    </dd>
                  </div>
                </dl>

                <div className="mt-8">
                  <label htmlFor="notes" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Notas o requerimientos especiales (Opcional)</label>
                  <textarea
                    id="notes"
                    rows={3}
                    placeholder="Ej: Necesito un adaptador HDMI, acceso para invitado..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-3 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-colors"
                  />
                </div>

                {bookingError && (
                  <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 font-medium">
                    {bookingError}
                  </div>
                )}

                <div className="mt-6 flex items-start gap-3 text-gray-500 dark:text-gray-400 text-sm bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-900/20">
                  <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p>Al confirmar, aceptas los términos de uso del espacio. Recuerda cancelar con anticipación si no vas a asistir para liberar el lugar.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between items-center px-2">
          <button
            onClick={handlePrev}
            className={`flex items-center px-4 md:px-6 py-3 md:py-3.5 border-2 border-gray-200 dark:border-gray-700 shadow-sm text-sm md:text-base font-bold rounded-2xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all active:scale-95
              ${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
          >
            <ChevronLeft className="mr-2 w-5 h-5" />
            <span className="hidden sm:inline">Volver</span>
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center px-6 md:px-8 py-3 md:py-3.5 border border-transparent shadow-md text-sm md:text-base font-bold rounded-2xl text-white transition-all duration-300 active:scale-95
                ${!canProceed() ? 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg'}`}
            >
              Continuar
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex items-center px-6 md:px-10 py-3 md:py-3.5 border border-transparent shadow-lg text-sm md:text-base font-bold rounded-2xl text-white bg-emerald-600 hover:bg-emerald-700 hover:scale-105 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? 'Reservando...' : '¡Confirmar!'}
              <CheckCircle2 className="ml-2 w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 shrink-0 hidden lg:block">
        <div className="sticky top-24 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mb-6">Tu Selección</h3>
          <div className="space-y-6">
            <div className={`relative pl-8 transition-opacity duration-300 ${!selectedDate ? 'opacity-40' : 'opacity-100'}`}>
              <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedDate ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600'}`}>
                {selectedDate && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Día</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">
                {selectedDate ? format(selectedDate, "EEEE, d MMM yyyy", { locale: es }) : 'Pendiente...'}
              </p>
            </div>
            <div className={`relative pl-8 transition-opacity duration-300 ${!selectedType ? 'opacity-40' : 'opacity-100'}`}>
              <div className="absolute left-2 top-[-20px] w-0.5 h-6 bg-gray-200 dark:bg-gray-700"></div>
              <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white dark:bg-gray-900 z-10 ${selectedType ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600'}`}>
                {selectedType && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Espacio</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {selectedType ? (selectedType === 'room' ? 'Sala Privada' : 'Escritorio Flex') : 'Pendiente...'}
              </p>
            </div>
            <div className={`relative pl-8 transition-opacity duration-300 ${selectedSlots.length === 0 ? 'opacity-40' : 'opacity-100'}`}>
              <div className="absolute left-2 top-[-20px] w-0.5 h-6 bg-gray-200 dark:bg-gray-700"></div>
              <div className={`absolute left-0 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-white dark:bg-gray-900 z-10 ${selectedSlots.length > 0 ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 dark:border-gray-600'}`}>
                {selectedSlots.length > 0 && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Horario</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {selectedSlots.length > 0
                  ? `${selectedSlots[0]} a ${(parseInt(selectedSlots[selectedSlots.length - 1].split(':')[0], 10) + 1).toString().padStart(2, '0')}:00`
                  : 'Pendiente...'}
              </p>
            </div>
          </div>
          {step < 4 && canProceed() && (
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 animate-in fade-in">
              <p className="text-xs text-center text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded-lg">
                ¡Todo listo! Clic en "Continuar".
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
