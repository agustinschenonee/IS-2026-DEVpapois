import { useNavigate } from "react-router";
import { useAppContext } from "../context/AppContext";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { PlusCircle, Clock, MapPin, CheckCircle2, CalendarDays, Users, Star, ChevronDown, MessageSquare } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState } from "react";

export function Dashboard() {
  const navigate = useNavigate();
  const { reservations, resources } = useAppContext();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const upcomingReservations = reservations
    .filter((res) => res.status === "active")
    .sort((a, b) => new Date(`${a.date}T${a.startTime}`).getTime() - new Date(`${b.date}T${b.startTime}`).getTime())
    .slice(0, 3);

  const featuredSpaces = resources.filter(r => r.isActive).slice(0, 3);

  const faqs = [
    {
      q: "¿Puedo cancelar mi reserva si surge un imprevisto?",
      a: "Sí, puedes cancelar tu reserva desde la sección 'Mis Reservas' hasta 2 horas antes de tu horario de ingreso sin ningún cargo."
    },
    {
      q: "¿Qué incluye la reserva de un Escritorio Flex?",
      a: "Incluye acceso a WiFi de alta velocidad, café libre, uso de áreas comunes y cabinas telefónicas para llamadas cortas."
    },
    {
      q: "¿Se puede reservar para grupos de trabajo?",
      a: "¡Claro! Las salas de reuniones están diseñadas para grupos y puedes filtrar por capacidad. Solo necesitas realizar la reserva a nombre de una persona."
    }
  ];

  return (
    <div className="space-y-12 pb-12 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-emerald-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-emerald-800">
        <div className="absolute inset-0">
          <ImageWithFallback 
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
            alt="DevPapois Coworking" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/95 to-emerald-900/60 mix-blend-multiply"></div>
        </div>
        
        <div className="relative z-10 px-8 py-16 md:py-24 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/50 border border-emerald-700/50 text-emerald-300 text-sm font-bold mb-6 backdrop-blur-sm">
              <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
              <span>Tu espacio creativo en la ciudad</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-sm">
              Bienvenido a <span className="text-emerald-400">DevPapois</span>
            </h1>
            <p className="text-lg md:text-xl text-emerald-100/90 mb-8 leading-relaxed max-w-xl font-medium">
              Somos más que un coworking. Somos una comunidad de creadores, desarrolladores y emprendedores. Encuentra el espacio perfecto para tu próxima gran idea.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate("/book")}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl shadow-lg text-emerald-950 bg-white hover:bg-emerald-50 hover:scale-105 transition-all duration-300"
              >
                <PlusCircle className="mr-2" size={24} />
                Reservar un Espacio
              </button>
              <button
                onClick={() => {
                  document.getElementById('espacios-destacados')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-2xl text-white bg-emerald-800/40 border border-emerald-600/50 hover:bg-emerald-700/60 backdrop-blur-md transition-all duration-300"
              >
                Ver Catálogo
              </button>
            </div>
          </div>
          
          <div className="hidden lg:block w-full max-w-md">
            <div className="bg-emerald-950/40 backdrop-blur-xl border border-white/10 p-6 rounded-3xl shadow-2xl">
              <h3 className="text-white font-bold text-xl mb-4 flex items-center gap-2">
                <Clock className="text-emerald-400" />
                Tus Próximas Reservas
              </h3>
              {upcomingReservations.length === 0 ? (
                <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/5">
                  <CalendarDays className="mx-auto h-10 w-10 text-emerald-400/50 mb-3" />
                  <p className="text-emerald-100/70 text-sm">No tienes reservas próximas</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReservations.slice(0, 2).map((res) => {
                    const resource = resources.find((r) => r.id === res.resourceId);
                    return (
                      <div key={res.id} className="bg-white/10 border border-white/10 rounded-2xl p-4 shadow-sm flex items-center gap-3 hover:bg-white/15 transition-colors">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                          <ImageWithFallback src={resource?.imageUrl || ''} alt="Espacio" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-bold text-sm line-clamp-1">{resource?.name}</p>
                          <p className="text-emerald-300 font-medium text-xs mt-0.5">
                            {format(parseISO(res.date), "d MMM", { locale: es })} • {res.startTime}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  {upcomingReservations.length > 2 && (
                    <button onClick={() => navigate('/reservations')} className="w-full text-center text-sm font-bold text-emerald-300 hover:text-emerald-200 mt-3 transition-colors">
                      Ver todas las reservas →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats / Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group">
          <div className="bg-emerald-50 dark:bg-emerald-900/50 p-4 rounded-2xl group-hover:scale-110 transition-transform">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Sin Conflictos</p>
            <p className="text-gray-900 dark:text-gray-200 text-sm font-medium">Sistema inteligente antireservas dobles.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:border-blue-300 dark:hover:border-blue-700 transition-colors group">
          <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-2xl group-hover:scale-110 transition-transform">
            <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Salas Equipadas</p>
            <p className="text-gray-900 dark:text-gray-200 text-sm font-medium">{resources.filter(r => r.type === 'room' && r.isActive).length} salas privadas para tu equipo.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-5 hover:border-purple-300 dark:hover:border-purple-700 transition-colors group">
          <div className="bg-purple-50 dark:bg-purple-900/50 p-4 rounded-2xl group-hover:scale-110 transition-transform">
            <MapPin className="h-8 w-8 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Zonas Flex</p>
            <p className="text-gray-900 dark:text-gray-200 text-sm font-medium">{resources.filter(r => r.type === 'desk' && r.isActive).length} escritorios en áreas abiertas.</p>
          </div>
        </div>
      </div>

      {/* Featured Spaces */}
      <div id="espacios-destacados" className="pt-8 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Espacios Destacados</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Descubre nuestras zonas más populares y reservadas.</p>
          </div>
          <button 
            onClick={() => navigate("/book")}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1 group"
          >
            Ver catálogo completo 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredSpaces.map(space => (
            <div key={space.id} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 dark:hover:border-gray-700 transition-all duration-300 group flex flex-col">
              <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                <ImageWithFallback 
                  src={space.imageUrl} 
                  alt={space.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5 shadow-sm">
                  {space.type === 'room' ? <Users size={14} className="text-blue-600 dark:text-blue-400" /> : <MapPin size={14} className="text-purple-600 dark:text-purple-400" />}
                  Hasta {space.capacity} pers.
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white line-clamp-1">{space.name}</h3>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-6">{space.description}</p>
                
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {space.amenities?.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium border border-gray-100 dark:border-gray-700">
                        {amenity}
                      </span>
                    ))}
                    {space.amenities && space.amenities.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 text-xs font-medium border border-gray-100 dark:border-gray-700">
                        +{space.amenities.length - 3}
                      </span>
                    )}
                  </div>
                  <button 
                    onClick={() => navigate("/book")}
                    className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-emerald-700 dark:text-emerald-400 font-bold rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors group-hover:bg-emerald-600 dark:group-hover:bg-emerald-500 group-hover:text-white dark:group-hover:text-gray-900 group-hover:border-emerald-600 dark:group-hover:border-emerald-500"
                  >
                    Reservar este espacio
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs and Testimonials Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-gray-200 dark:border-gray-800">
        <div>
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
              <MessageSquare className="text-emerald-500" /> 
              Preguntas Frecuentes
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Todo lo que necesitas saber antes de venir.</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden transition-colors">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-gray-900 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`text-gray-400 dark:text-gray-500 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-t border-gray-50 dark:border-gray-800 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-[2rem] p-8 md:p-10 border border-emerald-100 dark:border-emerald-800/50 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-emerald-950 dark:text-emerald-100 mb-8">Lo que dicen en nuestra comunidad</h2>
          
          <div className="relative">
            <div className="text-6xl text-emerald-200 dark:text-emerald-800/50 absolute -top-6 -left-2 font-serif">"</div>
            <div className="relative z-10 space-y-6">
              <p className="text-lg text-gray-700 dark:text-gray-300 font-medium italic leading-relaxed">
                Trabajar desde DevPapois me ha permitido conocer a otros desarrolladores y escalar mi proyecto de software muchísimo más rápido. La gestión de reservas es impecable.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-200 dark:bg-emerald-800 rounded-full flex items-center justify-center text-emerald-700 dark:text-emerald-200 font-bold text-xl">
                  P
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Priscila Galeano</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">Dev Lead</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
