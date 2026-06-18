import { useState, useRef } from "react";
import { useAppContext, Resource, ResourceType } from "../context/AppContext";
import {
  Building2,
  Settings2,
  PlusCircle,
  Monitor,
  Users,
  Trash2,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Calendar as CalendarIcon,
  AlertCircle,
  Edit3,
  X,
  Plus,
  Image as ImageIcon,
  Upload,
  Loader2,
  Download
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "../services/supabase";
import { exportToExcel } from '../lib/exportReservations';
const BUCKET_NAME = "recursos";

async function uploadImageToStorage(file: File): Promise<string> {
  const ext = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, { upsert: false });

  if (error) throw new Error(`Error al subir imagen: ${error.message}`);

  const { data: publicData } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  return publicData.publicUrl;
}

export function AdminDashboard() {
  const { resources, addResource, updateResource, deleteResource, blocks, addBlock, removeBlock, reservations, cancelReservation } = useAppContext();

  const handleExport = () => {
    const userMap: Record<string, string> = {};
    reservations.forEach(r => {
      if (r.userId) userMap[r.userId] = r.userId;
    });
    exportToExcel(reservations, resources, userMap);
  };
  
  const [activeTab, setActiveTab] = useState<'resources' | 'blocks' | 'reservations'>('resources');
  
  // New Resource State
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [newResource, setNewResource] = useState<{
    name: string;
    type: ResourceType;
    capacity: number;
    description: string;
    imageUrl: string;
    amenities: string[];
  }>({
    name: "",
    type: "desk",
    capacity: 1,
    description: "",
    imageUrl: "",
    amenities: []
  });
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>("");
  const [isUploadingNew, setIsUploadingNew] = useState(false);
  const newFileInputRef = useRef<HTMLInputElement>(null);

  // Edit Resource State
  const [editingResource, setEditingResource] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    name: string;
    type: ResourceType;
    capacity: number;
    description: string;
    imageUrl: string;
    amenities: string[];
  }>({
    name: "",
    type: "desk",
    capacity: 1,
    description: "",
    imageUrl: "",
    amenities: []
  });
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const [isUploadingEdit, setIsUploadingEdit] = useState(false);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // New Block State
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [newBlock, setNewBlock] = useState<{date: string, resourceId: string, reason: string}>({
    date: "", resourceId: "all", reason: ""
  });

  const handleNewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImageFile(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResource.name.trim()) return;

    let finalImageUrl = newResource.imageUrl;

    if (newImageFile) {
      setIsUploadingNew(true);
      try {
        finalImageUrl = await uploadImageToStorage(newImageFile);
      } catch (err) {
        console.error(err);
        setIsUploadingNew(false);
        return;
      }
      setIsUploadingNew(false);
    }

    await addResource({
      name: newResource.name,
      type: newResource.type,
      capacity: newResource.capacity,
      isActive: true,
      imageUrl: finalImageUrl || (newResource.type === 'room'
        ? 'https://images.unsplash.com/photo-1703355685952-03ed19f70f51?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZWV0aW5nJTIwcm9vbXxlbnwxfHx8fDE3NzU2NDkxMDF8MA&ixlib=rb-4.1.0&q=80&w=1080'
        : 'https://images.unsplash.com/photo-1623679116710-78b05d2fe2f3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjBkZXNrfGVufDF8fHx8MTc3NTY2MjY3N3ww&ixlib=rb-4.1.0&q=80&w=1080'),
      amenities: newResource.amenities.length > 0 ? newResource.amenities : (newResource.type === 'room' ? ['WiFi', 'TV', 'Pizarra'] : ['WiFi', 'Enchufe']),
      description: newResource.description || 'Nuevo espacio creado desde administración.'
    });

    setIsAddingResource(false);
    setNewResource({ name: "", type: "desk", capacity: 1, description: "", imageUrl: "", amenities: [] });
    setNewImageFile(null);
    setNewImagePreview("");
    if (newFileInputRef.current) newFileInputRef.current.value = "";
  };

  const handleEditResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource || !editForm.name.trim()) return;

    let finalImageUrl = editForm.imageUrl;

    if (editImageFile) {
      setIsUploadingEdit(true);
      try {
        finalImageUrl = await uploadImageToStorage(editImageFile);
      } catch (err) {
        console.error(err);
        setIsUploadingEdit(false);
        return;
      }
      setIsUploadingEdit(false);
    }

    await updateResource(editingResource, {
      name: editForm.name,
      type: editForm.type,
      capacity: editForm.capacity,
      description: editForm.description,
      imageUrl: finalImageUrl,
      amenities: editForm.amenities
    });

    setEditingResource(null);
    setEditImageFile(null);
    setEditImagePreview("");
    if (editFileInputRef.current) editFileInputRef.current.value = "";
  };

  const startEditingResource = (resource: Resource) => {
    setEditingResource(resource.id);
    setEditForm({
      name: resource.name,
      type: resource.type,
      capacity: resource.capacity,
      description: resource.description,
      imageUrl: resource.imageUrl,
      amenities: [...resource.amenities]
    });
    setEditImageFile(null);
    setEditImagePreview("");
  };

  const addAmenity = (amenity: string, isEdit: boolean = false) => {
    if (amenity.trim()) {
      if (isEdit) {
        setEditForm(prev => ({
          ...prev,
          amenities: [...prev.amenities, amenity.trim()]
        }));
      } else {
        setNewResource(prev => ({
          ...prev,
          amenities: [...prev.amenities, amenity.trim()]
        }));
      }
    }
  };

  const removeAmenity = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      setEditForm(prev => ({
        ...prev,
        amenities: prev.amenities.filter((_, i) => i !== index)
      }));
    } else {
      setNewResource(prev => ({
        ...prev,
        amenities: prev.amenities.filter((_, i) => i !== index)
      }));
    }
  };

  const handleAddBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newBlock.date && newBlock.reason.trim()) {
      await addBlock({
        date: newBlock.date,
        resourceId: newBlock.resourceId,
        reason: newBlock.reason
      });
      setIsAddingBlock(false);
      setNewBlock({ date: "", resourceId: "all", reason: "" });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 transition-colors duration-300">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <ShieldAlert className="text-amber-500" size={32} />
          Panel de Administración
        </h1>
        <p className="mt-1 text-lg text-gray-500 dark:text-gray-400">Gestiona los espacios, salas y bloqueos del coworking.</p>
      </div>

      <div className="border-b border-gray-200 dark:border-gray-800">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('resources')}
            className={`${
              activeTab === 'resources'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
          >
            <Building2 size={18} />
            Espacios y Salas
          </button>
          <button
            onClick={() => setActiveTab('blocks')}
            className={`${
              activeTab === 'blocks'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
          >
            <Settings2 size={18} />
            Mantenimiento y Bloqueos
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`${
              activeTab === 'reservations'
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-700'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors`}
          >
            <CalendarIcon size={18} />
            Todas las Reservas
          </button>
        </nav>
      </div>

      {activeTab === 'resources' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Inventario de Espacios</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total: {resources.length} espacios registrados.</p>
            </div>
            {!isAddingResource && (
              <button
                onClick={() => setIsAddingResource(true)}
                className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-emerald-700 hover:scale-105 transition-all shadow-sm"
              >
                <PlusCircle size={20} />
                Nuevo Espacio
              </button>
            )}
          </div>

          {isAddingResource && (
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4">
              <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mb-4 flex items-center gap-2">
                <PlusCircle size={20} className="text-emerald-600 dark:text-emerald-400"/> Agregar Nuevo Espacio
              </h3>
              <form onSubmit={handleAddResource} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1.5">Nombre *</label>
                    <input
                      type="text"
                      required
                      value={newResource.name}
                      onChange={e => setNewResource({...newResource, name: e.target.value})}
                      className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      placeholder="Ej. Sala de Juntas C"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1.5">Tipo *</label>
                      <select
                        value={newResource.type}
                        onChange={e => setNewResource({...newResource, type: e.target.value as ResourceType})}
                        className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      >
                        <option value="desk">Escritorio</option>
                        <option value="room">Sala</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1.5">Capacidad *</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={newResource.capacity}
                        onChange={e => setNewResource({...newResource, capacity: parseInt(e.target.value)})}
                        className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1.5">Descripción</label>
                  <textarea
                    value={newResource.description}
                    onChange={e => setNewResource({...newResource, description: e.target.value})}
                    rows={2}
                    className="w-full rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm resize-none"
                    placeholder="Describe las características principales del espacio..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1.5 flex items-center gap-2">
                    <ImageIcon size={16} />
                    Imagen del espacio
                  </label>
                  <div
                    className="w-full rounded-xl border-2 border-dashed border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-gray-800 p-4 cursor-pointer hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors"
                    onClick={() => newFileInputRef.current?.click()}
                  >
                    {newImagePreview ? (
                      <div className="flex items-center gap-4">
                        <img src={newImagePreview} alt="Vista previa" className="h-20 w-32 object-cover rounded-lg shadow-sm" />
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">{newImageFile?.name}</span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Upload size={12} /> Haz clic para cambiar</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-center">
                        <Upload size={28} className="text-emerald-400 dark:text-emerald-600 mb-2" />
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Haz clic para seleccionar una imagen</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, WEBP (opcional)</span>
                      </div>
                    )}
                  </div>
                  <input
                    ref={newFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleNewImageChange}
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-emerald-900 dark:text-emerald-100 mb-1.5">Amenidades</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {newResource.amenities.map((amenity, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                        {amenity}
                        <button type="button" onClick={() => removeAmenity(index, false)} className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="new-amenity"
                      className="flex-1 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-white dark:bg-gray-800 p-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
                      placeholder="Ej. WiFi, TV, Pizarra..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.currentTarget;
                          addAmenity(input.value, false);
                          input.value = '';
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('new-amenity') as HTMLInputElement;
                        addAmenity(input.value, false);
                        input.value = '';
                      }}
                      className="bg-emerald-600 text-white p-2.5 rounded-xl hover:bg-emerald-700 shadow-sm transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={isUploadingNew}
                    className="bg-emerald-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-emerald-700 flex-1 shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isUploadingNew ? (
                      <><Loader2 size={18} className="animate-spin" /> Subiendo imagen...</>
                    ) : (
                      'Guardar Espacio'
                    )}
                  </button>
                  <button type="button" onClick={() => {
                    setIsAddingResource(false);
                    setNewResource({ name: "", type: "desk", capacity: 1, description: "", imageUrl: "", amenities: [] });
                    setNewImageFile(null);
                    setNewImagePreview("");
                    if (newFileInputRef.current) newFileInputRef.current.value = "";
                  }} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 px-5 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => {
              const isEditing = editingResource === resource.id;

              if (isEditing) {
                return (
                  <div key={resource.id} className="md:col-span-2 lg:col-span-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-6 rounded-2xl animate-in fade-in">
                    <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                      <Edit3 size={20} className="text-blue-600 dark:text-blue-400"/> Editar Espacio
                    </h3>
                    <form onSubmit={handleEditResource} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold text-blue-900 dark:text-blue-100 mb-1.5">Nombre *</label>
                          <input
                            type="text"
                            required
                            value={editForm.name}
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                            className="w-full rounded-xl border border-blue-200 dark:border-blue-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-blue-900 dark:text-blue-100 mb-1.5">Tipo *</label>
                            <select
                              value={editForm.type}
                              onChange={e => setEditForm({...editForm, type: e.target.value as ResourceType})}
                              className="w-full rounded-xl border border-blue-200 dark:border-blue-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            >
                              <option value="desk">Escritorio</option>
                              <option value="room">Sala</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-blue-900 dark:text-blue-100 mb-1.5">Capacidad *</label>
                            <input
                              type="number"
                              min="1"
                              required
                              value={editForm.capacity}
                              onChange={e => setEditForm({...editForm, capacity: parseInt(e.target.value)})}
                              className="w-full rounded-xl border border-blue-200 dark:border-blue-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-blue-900 dark:text-blue-100 mb-1.5">Descripción</label>
                        <textarea
                          value={editForm.description}
                          onChange={e => setEditForm({...editForm, description: e.target.value})}
                          rows={2}
                          className="w-full rounded-xl border border-blue-200 dark:border-blue-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-blue-900 dark:text-blue-100 mb-1.5 flex items-center gap-2">
                          <ImageIcon size={16} />
                          Imagen del espacio
                        </label>
                        <div
                          className="w-full rounded-xl border-2 border-dashed border-blue-200 dark:border-blue-800/50 bg-white dark:bg-gray-800 p-4 cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
                          onClick={() => editFileInputRef.current?.click()}
                        >
                          {editImagePreview ? (
                            <div className="flex items-center gap-4">
                              <img src={editImagePreview} alt="Vista previa nueva" className="h-20 w-32 object-cover rounded-lg shadow-sm" />
                              <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">{editImageFile?.name}</span>
                                <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"><Upload size={12} /> Nueva imagen seleccionada · Haz clic para cambiar</span>
                              </div>
                            </div>
                          ) : editForm.imageUrl ? (
                            <div className="flex items-center gap-4">
                              <img src={editForm.imageUrl} alt="Imagen actual" className="h-20 w-32 object-cover rounded-lg shadow-sm" />
                              <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Imagen actual</span>
                                <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1"><Upload size={12} /> Haz clic para reemplazar</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center py-4 text-center">
                              <Upload size={28} className="text-blue-400 dark:text-blue-600 mb-2" />
                              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Haz clic para seleccionar una imagen</span>
                              <span className="text-xs text-gray-400 dark:text-gray-500 mt-1">PNG, JPG, WEBP (opcional)</span>
                            </div>
                          )}
                        </div>
                        <input
                          ref={editFileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleEditImageChange}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-blue-900 dark:text-blue-100 mb-1.5">Amenidades</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {editForm.amenities.map((amenity, index) => (
                            <span key={index} className="inline-flex items-center gap-1.5 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800/50 text-blue-900 dark:text-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium">
                              {amenity}
                              <button type="button" onClick={() => removeAmenity(index, true)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                                <X size={14} />
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id="edit-amenity"
                            className="flex-1 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-white dark:bg-gray-800 p-2.5 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                            placeholder="Ej. WiFi, TV, Pizarra..."
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const input = e.currentTarget;
                                addAmenity(input.value, true);
                                input.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById('edit-amenity') as HTMLInputElement;
                              addAmenity(input.value, true);
                              input.value = '';
                            }}
                            className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 shadow-sm transition-colors"
                          >
                            <Plus size={18} />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          disabled={isUploadingEdit}
                          className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 flex-1 shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isUploadingEdit ? (
                            <><Loader2 size={18} className="animate-spin" /> Subiendo imagen...</>
                          ) : (
                            'Guardar Cambios'
                          )}
                        </button>
                        <button type="button" onClick={() => {
                          setEditingResource(null);
                          setEditImageFile(null);
                          setEditImagePreview("");
                          if (editFileInputRef.current) editFileInputRef.current.value = "";
                        }} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 px-5 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-colors">
                          Cancelar
                        </button>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div key={resource.id} className={`bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border p-6 transition-all duration-300
                  ${!resource.isActive ? 'border-gray-200 dark:border-gray-800 opacity-75 grayscale-[50%]' : 'border-gray-100 dark:border-gray-800 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 hover:-translate-y-1'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-4 rounded-2xl ${resource.type === 'room' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'}`}>
                      {resource.type === 'room' ? <Users size={28} /> : <Monitor size={28} />}
                    </div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      <button
                        onClick={() => startEditingResource(resource)}
                        title="Editar"
                        className="p-2.5 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors shadow-sm"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => updateResource(resource.id, { isActive: !resource.isActive })}
                        title={resource.isActive ? "Desactivar" : "Activar"}
                        className={`p-2.5 rounded-xl transition-colors shadow-sm border ${
                          resource.isActive ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-800/50' : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        {resource.isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                      </button>
                      <button
                        onClick={async () => { await deleteResource(resource.id); }}
                        title="Eliminar"
                        className="p-2.5 rounded-xl text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors shadow-sm"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-extrabold text-xl text-gray-900 dark:text-white mb-2 line-clamp-1">{resource.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{resource.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {resource.amenities.slice(0, 3).map((amenity, i) => (
                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs font-medium">
                        {amenity}
                      </span>
                    ))}
                    {resource.amenities.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-medium">
                        +{resource.amenities.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider text-xs">{resource.type === 'room' ? 'Sala Privada' : 'Escritorio Flex'}</span>
                    <span className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg font-bold">{resource.capacity} pers.</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'blocks' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Fechas Bloqueadas</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Inhabilita reservas para mantenimiento, feriados o eventos.</p>
            </div>
            {!isAddingBlock && (
              <button
                onClick={() => setIsAddingBlock(true)}
                className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-amber-700 hover:scale-105 transition-all shadow-sm"
              >
                <AlertCircle size={20} />
                Nuevo Bloqueo
              </button>
            )}
          </div>

          {isAddingBlock && (
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/50 p-6 rounded-2xl animate-in fade-in slide-in-from-top-4">
              <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-amber-600 dark:text-amber-400"/> Crear Bloqueo de Calendario
              </h3>
              <form onSubmit={handleAddBlock} className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                <div className="w-full md:w-48">
                  <label className="block text-sm font-bold text-amber-900 dark:text-amber-100 mb-1.5">Fecha</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={newBlock.date}
                    onChange={e => setNewBlock({...newBlock, date: e.target.value})}
                    className="w-full rounded-xl border border-amber-200 dark:border-amber-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  />
                </div>
                <div className="w-full md:w-64">
                  <label className="block text-sm font-bold text-amber-900 dark:text-amber-100 mb-1.5">Espacio a bloquear</label>
                  <select
                    value={newBlock.resourceId}
                    onChange={e => setNewBlock({...newBlock, resourceId: e.target.value})}
                    className="w-full rounded-xl border border-amber-200 dark:border-amber-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                  >
                    <option value="all">TODOS LOS ESPACIOS (Cierre total)</option>
                    <optgroup label="Espacios Específicos">
                      {resources.map(r => (
                        <option key={r.id} value={r.id}>{r.name} ({r.type === 'room' ? 'Sala' : 'Flex'})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
                <div className="flex-1 w-full">
                  <label className="block text-sm font-bold text-amber-900 dark:text-amber-100 mb-1.5">Motivo / Razón</label>
                  <input
                    type="text"
                    required
                    value={newBlock.reason}
                    onChange={e => setNewBlock({...newBlock, reason: e.target.value})}
                    className="w-full rounded-xl border border-amber-200 dark:border-amber-800/50 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    placeholder="Ej. Feriado Nacional, Mantenimiento Eléctrico..."
                  />
                </div>
                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                  <button type="submit" className="bg-amber-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-amber-700 w-full md:w-auto shadow-sm transition-colors">
                    Bloquear
                  </button>
                  <button type="button" onClick={() => setIsAddingBlock(false)} className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 px-5 py-3 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 w-full md:w-auto shadow-sm transition-colors">
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {blocks.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 p-12 rounded-[2rem] shadow-sm border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
              <CalendarIcon className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No hay bloqueos activos</h3>
              <p className="text-gray-500 dark:text-gray-400">Todo el coworking está operando con normalidad.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <ul className="divide-y divide-gray-100 dark:divide-gray-800">
                {blocks.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(block => {
                  const resourceName = block.resourceId === 'all' 
                    ? 'Cierre Total (Todos los espacios)' 
                    : resources.find(r => r.id === block.resourceId)?.name || 'Espacio desconocido';
                  
                  return (
                    <li key={block.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl shrink-0 ${block.resourceId === 'all' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'}`}>
                          <AlertCircle size={24} />
                        </div>
                        <div>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">{block.reason}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm">
                            <span className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 font-medium">
                              <CalendarIcon size={16} className="text-gray-400" />
                              {format(parseISO(block.date), "EEEE, d 'de' MMMM yyyy", { locale: es })}
                            </span>
                            <span className="hidden sm:inline text-gray-300 dark:text-gray-600">•</span>
                            <span className={`font-bold px-2.5 py-0.5 rounded-md text-xs uppercase tracking-wide
                              ${block.resourceId === 'all' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700'}`}>
                              {resourceName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={async () => { await removeBlock(block.id); }}
                        className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm font-bold rounded-xl text-red-600 dark:text-red-400 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-200 dark:hover:border-red-800/50 transition-colors shadow-sm"
                      >
                        <Trash2 size={16} />
                        Eliminar Bloqueo
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex justify-between items-center bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Todas las Reservas</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Vista global de todas las reservas de los miembros.</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm"
            >
              Exportar a Excel
            </button>
          </div>

          {reservations.length === 0 ? (
            <div className="bg-white dark:bg-gray-900 p-12 rounded-[2rem] shadow-sm border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
              <CalendarIcon className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No hay reservas registradas</h3>
              <p className="text-gray-500 dark:text-gray-400">Aún no se ha realizado ninguna reserva en el coworking.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Horario</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Espacio</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {[...reservations].sort((a, b) => new Date(`${b.date}T${b.startTime}`).getTime() - new Date(`${a.date}T${a.startTime}`).getTime()).map(res => {
                      const resource = resources.find(r => r.id === res.resourceId);
                      return (
                        <tr key={res.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">
                              {format(parseISO(res.date), "dd/MM/yyyy")}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                              {res.startTime} - {res.endTime}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-bold text-gray-900 dark:text-white">{resource?.name || 'Desconocido'}</div>
                            {res.notes && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xs truncate" title={res.notes}>
                                Nota: {res.notes}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide
                              ${res.status === 'active' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                              {res.status === 'active' ? 'Activa' : 'Cancelada'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            {res.status === 'active' && (
                              <button
                                onClick={() => cancelReservation(res.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm font-bold transition-colors"
                              >
                                Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
