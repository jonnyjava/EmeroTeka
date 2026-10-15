'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertTriangle,
  X,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MagazineAdminDTO, MagazineInput, MagazineInputSchema } from '../domain/MagazineAdminEntity';
import {
  getAdminMagazinesAction,
  createAdminMagazineAction,
  updateAdminMagazineAction,
  deleteAdminMagazineAction,
} from '@/app/actions/admin';

export function MagazineManagementSection() {
  const [magazines, setMagazines] = useState<MagazineAdminDTO[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMagazine, setEditingMagazine] = useState<MagazineAdminDTO | null>(null);
  const [deletingMagazine, setDeletingMagazine] = useState<MagazineAdminDTO | null>(null);

  // Form states
  const [formData, setFormData] = useState<MagazineInput>({
    name: '',
    publisher: '',
    country: '',
    issn: '',
    description: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let ignore = false;
    async function fetchMagazines() {
      try {
        const res = await getAdminMagazinesAction(search || undefined);
        if (!ignore) {
          if (res.success && res.data) {
            setMagazines(res.data);
          } else {
            setErrorMessage(res.error || 'Error al cargar las revistas.');
          }
          setIsLoading(false);
        }
      } catch (err: unknown) {
        if (!ignore) {
          setErrorMessage(err instanceof Error ? err.message : 'Error inesperado.');
          setIsLoading(false);
        }
      }
    }

    fetchMagazines();
    return () => {
      ignore = true;
    };
  }, [search, refreshKey]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingMagazine(null);
    setFormData({
      name: '',
      publisher: '',
      country: '',
      issn: '',
      description: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (mag: MagazineAdminDTO) => {
    setEditingMagazine(mag);
    setFormData({
      name: mag.name,
      publisher: mag.publisher || '',
      country: mag.country || '',
      issn: mag.issn || '',
      description: mag.description || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Submit create or edit form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setErrorMessage(null);

    const validation = MagazineInputSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        if (issue.path[0]) {
          errors[String(issue.path[0])] = issue.message;
        }
      }
      setFormErrors(errors);
      return;
    }

    startTransition(async () => {
      try {
        if (editingMagazine) {
          const res = await updateAdminMagazineAction(editingMagazine.id, validation.data);
          if (res.success) {
            setSuccessMessage(`Revista "${validation.data.name}" actualizada con éxito.`);
            setIsModalOpen(false);
            setRefreshKey((k) => k + 1);
          } else {
            setErrorMessage(res.error || 'Error al actualizar revista.');
          }
        } else {
          const res = await createAdminMagazineAction(validation.data);
          if (res.success) {
            setSuccessMessage(`Revista "${validation.data.name}" creada con éxito.`);
            setIsModalOpen(false);
            setRefreshKey((k) => k + 1);
          } else {
            setErrorMessage(res.error || 'Error al crear revista.');
          }
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Error inesperado.');
      }
    });
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (!deletingMagazine) return;
    startTransition(async () => {
      try {
        const res = await deleteAdminMagazineAction(deletingMagazine.id);
        if (res.success) {
          setSuccessMessage(`Revista "${deletingMagazine.name}" eliminada.`);
          setDeletingMagazine(null);
          setRefreshKey((k) => k + 1);
        } else {
          setErrorMessage(res.error || 'Error al eliminar revista.');
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Error al eliminar revista.');
      }
    });
  };

  // Filtered view
  const magazineList = useMemo(() => magazines, [magazines]);

  return (
    <div data-testid="magazine-management-section" className="space-y-6">
      {/* Section Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#D2A446]" />
            <h2 className="text-xl font-serif font-bold text-[#1B275E]">
              Gestión de Revistas
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-sans">
            Crea, actualiza o elimina publicaciones periódicas y cabeceras del catálogo.
          </p>
        </div>

        <Button
          data-testid="magazine-create-btn"
          onClick={handleOpenCreate}
          className="bg-[#1B275E] hover:bg-[#2A3E92] text-white text-xs font-mono uppercase tracking-wider h-9 px-4 rounded-none flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D2A446]" />
          Nueva Revista
        </Button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div
          data-testid="magazine-success-alert"
          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div
          data-testid="magazine-error-alert"
          className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <Input
          data-testid="magazine-search-input"
          type="text"
          placeholder="Buscar revistas por nombre, país, editorial o ISSN..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 text-xs bg-white border-[#CBD5E1] rounded-none h-9 text-[#1B275E]"
        />
      </div>

      {/* Table / List */}
      <div className="bg-white border border-[#CBD5E1] shadow-xs overflow-x-auto">
        {isLoading ? (
          <div
            data-testid="magazine-loading-state"
            className="p-12 flex flex-col items-center justify-center text-center text-[#64748B]"
          >
            <Loader2 className="w-6 h-6 animate-spin text-[#D2A446] mb-2" />
            <span className="text-xs font-mono">Cargando catálogo de revistas...</span>
          </div>
        ) : magazineList.length === 0 ? (
          <div
            data-testid="magazine-empty-state"
            className="p-12 text-center text-[#64748B]"
          >
            <p className="text-sm font-serif font-bold text-[#1B275E]">
              No se encontraron revistas
            </p>
            <p className="text-xs mt-1">
              {search ? 'Intenta con otro término de búsqueda.' : 'Crea la primera revista pulsando "Nueva Revista".'}
            </p>
          </div>
        ) : (
          <table data-testid="magazines-table" className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0E152E] text-white font-mono uppercase tracking-wider text-[10px] border-b border-[#23356E]">
                <th className="py-3 px-4">Revista</th>
                <th className="py-3 px-4">Editorial & País</th>
                <th className="py-3 px-4">ISSN</th>
                <th className="py-3 px-4">Contenido</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {magazineList.map((mag) => (
                <tr
                  key={mag.id}
                  data-testid={`magazine-row-${mag.id}`}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-3 px-4 font-serif font-bold text-[#1B275E]">
                    <div className="flex flex-col">
                      <span className="text-sm">{mag.name}</span>
                      {mag.description && (
                        <span className="font-sans font-normal text-[11px] text-[#64748B] line-clamp-1 max-w-xs mt-0.5">
                          {mag.description}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans text-[#334155]">
                    <div>{mag.publisher || '—'}</div>
                    <div className="text-[11px] text-[#64748B]">{mag.country || '—'}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#475569]">
                    {mag.issn ? (
                      <Badge variant="outline" className="rounded-none border-[#CBD5E1] text-[10px]">
                        {mag.issn}
                      </Badge>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#64748B]">
                    <span>{mag.issuesCount ?? 0} ediciones</span> ·{' '}
                    <span>{mag.articlesCount ?? 0} artículos</span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        data-testid={`magazine-edit-btn-${mag.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(mag)}
                        className="h-8 w-8 p-0 text-[#1B275E] hover:bg-[#E2E8F0] cursor-pointer rounded-none"
                        title="Editar revista"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        data-testid={`magazine-delete-btn-${mag.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingMagazine(mag)}
                        className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 cursor-pointer rounded-none"
                        title="Eliminar revista"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Dialog: Create / Edit Magazine */}
      {isModalOpen && (
        <div
          data-testid="magazine-form-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-[#23356E] w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#D2A446]" />
                <h3 className="font-serif font-bold text-base text-[#1B275E]">
                  {editingMagazine ? 'Editar Revista' : 'Nueva Revista'}
                </h3>
              </div>
              <button
                data-testid="magazine-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#1B275E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#334155] mb-1 font-semibold">
                  Nombre de la Revista *
                </label>
                <Input
                  data-testid="magazine-form-name"
                  type="text"
                  required
                  placeholder="ej. National Geographic, Geo, Altaïr..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="text-xs rounded-none"
                />
                {formErrors.name && (
                  <p className="text-[11px] text-rose-600 mt-1 font-sans">{formErrors.name}</p>
                )}
              </div>

              {/* Publisher & Country */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                    Editorial / Publicador
                  </label>
                  <Input
                    data-testid="magazine-form-publisher"
                    type="text"
                    placeholder="ej. National Geographic Society"
                    value={formData.publisher || ''}
                    onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                    className="text-xs rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                    País de Origen
                  </label>
                  <Input
                    data-testid="magazine-form-country"
                    type="text"
                    placeholder="ej. Estados Unidos, España..."
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="text-xs rounded-none"
                  />
                </div>
              </div>

              {/* ISSN */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                  Código ISSN
                </label>
                <Input
                  data-testid="magazine-form-issn"
                  type="text"
                  placeholder="ej. 0027-9358"
                  value={formData.issn || ''}
                  onChange={(e) => setFormData({ ...formData, issn: e.target.value })}
                  className="text-xs font-mono rounded-none"
                />
                {formErrors.issn && (
                  <p className="text-[11px] text-rose-600 mt-1 font-sans">{formErrors.issn}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                  Descripción Histórica / Perfil Editorial
                </label>
                <textarea
                  data-testid="magazine-form-description"
                  rows={3}
                  placeholder="Reseña histórica, temática y enfoque de la publicación..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full text-xs p-2 border border-[#CBD5E1] rounded-none focus:outline-hidden focus:border-[#1B275E] text-[#1B275E]"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <Button
                  data-testid="magazine-cancel-btn"
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                  className="text-xs font-mono uppercase rounded-none h-9 px-4 cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  data-testid="magazine-submit-btn"
                  type="submit"
                  disabled={isPending}
                  className="bg-[#1B275E] hover:bg-[#2A3E92] text-white text-xs font-mono uppercase rounded-none h-9 px-4 flex items-center gap-2 cursor-pointer"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingMagazine ? 'Guardar Cambios' : 'Crear Revista'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingMagazine && (
        <div
          data-testid="magazine-delete-dialog"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-rose-300 w-full max-w-md shadow-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#1B275E]">
                  Eliminar Revista
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  ¿Estás seguro de que deseas eliminar permanentemente{' '}
                  <span className="font-semibold text-[#1B275E]">
                    &quot;{deletingMagazine.name}&quot;
                  </span>
                  ? Esta acción también eliminará todas las ediciones y artículos asociados a esta revista.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button
                data-testid="magazine-cancel-delete-btn"
                variant="outline"
                size="sm"
                onClick={() => setDeletingMagazine(null)}
                disabled={isPending}
                className="text-xs font-mono uppercase rounded-none h-8 px-3 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                data-testid="magazine-confirm-delete-btn"
                variant="destructive"
                size="sm"
                onClick={handleConfirmDelete}
                disabled={isPending}
                className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-mono uppercase rounded-none h-8 px-3 flex items-center gap-1.5 cursor-pointer"
              >
                {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirmar Eliminación</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
