import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthService } from '../services/AuthService';
import { AdminService } from '../services/AdminService';
import { TurnoService } from '../services/TurnoService';
import { BloqueoService } from '../services/BloqueoService';
import {
  dbRecursoToResource,
  dbTurnoToReservation,
  dbBloqueoToBlock,
  resourceToDbInsert,
  resourceToDbUpdate,
  blockToDbInsert,
} from '../services/adapters';

export type ResourceType = 'room' | 'desk';

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  capacity: number;
  isActive: boolean;
  imageUrl: string;
  amenities: string[];
  description: string;
}

export interface Reservation {
  id: string;
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'active' | 'cancelled' | 'completed';
  notes?: string;
}

export interface Block {
  id: string;
  resourceId: string | 'all';
  date: string;
  reason: string;
}

export interface UserPerfil {
  id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'member';
}

interface AppState {
  currentUser: UserPerfil | null;
  currentUserRole: 'member' | 'admin';
  resources: Resource[];
  reservations: Reservation[];
  blocks: Block[];
  loading: boolean;
  isDark: boolean;
}

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (nombre: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  addReservation: (res: Omit<Reservation, 'id' | 'status'>) => Promise<{ success: boolean; error?: string }>;
  cancelReservation: (id: string) => Promise<void>;
  addResource: (res: Omit<Resource, 'id'>) => Promise<void>;
  updateResource: (id: string, data: Partial<Resource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;
  addBlock: (block: Omit<Block, 'id'>) => Promise<void>;
  removeBlock: (id: string) => Promise<void>;
  reloadReservations: () => Promise<void>;
  toggleDarkMode: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Carga las reservas correctas según el rol: un admin necesita listarTodos(),
// listarPorUsuario() siempre filtra por ese id sin importar lo que permita RLS.
async function cargarReservas(userId: string, role: 'member' | 'admin'): Promise<Reservation[]> {
  const raw = role === 'admin'
    ? await TurnoService.listarTodos().catch(() => [])
    : await TurnoService.listarPorUsuario(userId).catch(() => []);
  return raw.map(dbTurnoToReservation);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    currentUser: null,
    currentUserRole: 'member',
    resources: [],
    reservations: [],
    blocks: [],
    loading: true,
    isDark: false,
  });

  // Sincroniza la clase 'dark' del <html> cada vez que cambia isDark, sin importar
  // cuántas veces se monte/desmonte MainLayout al navegar entre rutas.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.isDark);
  }, [state.isDark]);

  const toggleDarkMode = () => {
    setState(prev => ({ ...prev, isDark: !prev.isDark }));
  };

  // Carga inicial: sesión + recursos + bloqueos
  useEffect(() => {
    const init = async () => {
      const sesion = await AuthService.obtenerSesionCompleta();
      let user: UserPerfil | null = null;
      let role: 'member' | 'admin' = 'member';

      if (sesion) {
        user = {
          id: sesion.user.id,
          nombre: sesion.perfil.nombre,
          email: sesion.user.email ?? '',
          rol: sesion.perfil.rol,
        };
        role = sesion.perfil.rol === 'admin' ? 'admin' : 'member';
      }

      const [rawResources, rawBlocks] = await Promise.all([
        AdminService.listarRecursos().catch(() => []),
        BloqueoService.listarBloqueos().catch(() => []),
      ]);

      let reservations: Reservation[] = [];
      if (sesion) {
        reservations = await cargarReservas(sesion.user.id, role);
      }

      setState(prev => ({
        ...prev,
        currentUser: user,
        currentUserRole: role,
        resources: (rawResources ?? []).map(dbRecursoToResource),
        reservations,
        blocks: (rawBlocks ?? []).map(dbBloqueoToBlock),
        loading: false,
      }));
    };

    init();

    const { data: listener } = AuthService.onAuthStateChange(async (event) => {
      if (event === 'SIGNED_OUT') {
        setState(prev => ({
          ...prev,
          currentUser: null,
          currentUserRole: 'member',
          reservations: [],
        }));
      }
    });

    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await AuthService.login(email, password);
    if (!res.success) return { success: false, error: res.error };

    const user: UserPerfil = {
      id: res.user!.id,
      nombre: res.perfil.nombre,
      email: res.user!.email ?? '',
      rol: res.perfil.rol,
    };
    const role: 'member' | 'admin' = res.perfil.rol === 'admin' ? 'admin' : 'member';
    const reservations = await cargarReservas(res.user!.id, role);

    setState(prev => ({
      ...prev,
      currentUser: user,
      currentUserRole: role,
      reservations,
    }));
    return { success: true };
  };

  const register = async (nombre: string, email: string, password: string) => {
    const res = await AuthService.registrarEnDB({ nombre, email, password });
    if (!res.success) return { success: false, error: res.error };
    return { success: true };
  };

  const logout = async () => {
    await AuthService.logout();
    setState(prev => ({
      ...prev,
      currentUser: null,
      currentUserRole: 'member',
      reservations: [],
    }));
  };

  const reloadReservations = async () => {
    if (!state.currentUser) return;
    const reservations = await cargarReservas(state.currentUser.id, state.currentUserRole);
    setState(prev => ({ ...prev, reservations }));
  };

  const addReservation = async (res: Omit<Reservation, 'id' | 'status'>) => {
    if (!state.currentUser) return { success: false, error: 'No autenticado' };
    const result = await TurnoService.reservarTurno(
      state.currentUser.id,
      Number(res.resourceId),
      res.date,
      res.startTime + ':00',
      res.endTime + ':00',
      res.notes
    );
    if (!result.success) return { success: false, error: result.message };
    await reloadReservations();
    return { success: true };
  };

  const cancelReservation = async (id: string) => {
    await TurnoService.cancelarTurno(Number(id));
    await reloadReservations();
  };

  const addResource = async (res: Omit<Resource, 'id'>) => {
    if (!state.currentUser) return;
    const { tipo, datos } = resourceToDbInsert(res);
    await AdminService.crearNuevoRecurso(state.currentUser.id, tipo, datos);
    const raw = await AdminService.listarRecursos().catch(() => []);
    setState(prev => ({ ...prev, resources: (raw ?? []).map(dbRecursoToResource) }));
  };

  const updateResource = async (id: string, data: Partial<Resource>) => {
    if (!state.currentUser) return;
    const cambios = resourceToDbUpdate(data);
    await AdminService.actualizarRecurso(state.currentUser.id, Number(id), cambios);
    const raw = await AdminService.listarRecursos().catch(() => []);
    setState(prev => ({ ...prev, resources: (raw ?? []).map(dbRecursoToResource) }));
  };

  const deleteResource = async (id: string) => {
    if (!state.currentUser) return;
    await AdminService.eliminarRecurso(state.currentUser.id, Number(id));
    setState(prev => ({ ...prev, resources: prev.resources.filter(r => r.id !== id) }));
  };

  const addBlock = async (block: Omit<Block, 'id'>) => {
    if (!state.currentUser) return;
    const { recursoId, fecha, motivo } = blockToDbInsert(block);
    await BloqueoService.crearBloqueo(state.currentUser.id, { recursoId, fecha, motivo });
    const raw = await BloqueoService.listarBloqueos().catch(() => []);
    setState(prev => ({ ...prev, blocks: (raw ?? []).map(dbBloqueoToBlock) }));
  };

  const removeBlock = async (id: string) => {
    if (!state.currentUser) return;
    await BloqueoService.eliminarBloqueo(state.currentUser.id, Number(id));
    setState(prev => ({ ...prev, blocks: prev.blocks.filter(b => b.id !== id) }));
  };

  return (
    <AppContext.Provider value={{
      ...state,
      login,
      register,
      logout,
      addReservation,
      cancelReservation,
      addResource,
      updateResource,
      deleteResource,
      addBlock,
      removeBlock,
      reloadReservations,
      toggleDarkMode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
}