'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import Image from 'next/image';
import {
  BookMarked,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertTriangle,
  X,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  MagazineIssueAdminDTO,
  MagazineIssueInput,
  MagazineIssueInputSchema,
} from '../domain/MagazineIssueAdminEntity';
import { MagazineAdminDTO } from '../domain/MagazineAdminEntity';
import {
  getAdminMagazineIssuesAction,
  createAdminMagazineIssueAction,
  updateAdminMagazineIssueAction,
  deleteAdminMagazineIssueAction,
  getAdminMagazinesAction,
} from '@/app/actions/admin';

export function MagazineIssueManagementSection() {
  const [issues, setIssues] = useState<MagazineIssueAdminDTO[]>([]);
  const [magazines, setMagazines] = useState<MagazineAdminDTO[]>([]);
  const [search, setSearch] = useState('');
  const [selectedMagazineFilter, setSelectedMagazineFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<MagazineIssueAdminDTO | null>(null);
  const [deletingIssue, setDeletingIssue] = useState<MagazineIssueAdminDTO | null>(null);

  // Form states
  const [formData, setFormData] = useState<MagazineIssueInput>({
    magazineId: 0,
    issueNumber: '',
    year: new Date().getFullYear(),
    month: '',
    title: '',
    coverImageUrl: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [refreshKey, setRefreshKey] = useState(0);

  // Fetch magazines for filter and form dropdown
  useEffect(() => {
    async function loadMagazines() {
      try {
        const res = await getAdminMagazinesAction();
        if (res.success && res.data) {
          setMagazines(res.data);
        }
      } catch (err) {
        console.error('Failed to load magazines for options:', err);
      }
    }
    loadMagazines();
  }, [refreshKey]);

  // Fetch issues list
  useEffect(() => {
    let ignore = false;
    async function fetchIssues() {
      try {
        const magId = selectedMagazineFilter !== 'all' ? Number(selectedMagazineFilter) : undefined;
        const res = await getAdminMagazineIssuesAction({
          search: search || undefined,
          magazineId: magId,
        });
        if (!ignore) {
          if (res.success && res.data) {
            setIssues(res.data);
          } else {
            setErrorMessage(res.error || 'Error al cargar las ediciones.');
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

    fetchIssues();
    return () => {
      ignore = true;
    };
  }, [search, selectedMagazineFilter, refreshKey]);

  // Handle open create modal
  const handleOpenCreate = () => {
    setEditingIssue(null);
    setFormData({
      magazineId: magazines[0]?.id || 0,
      issueNumber: '',
      year: new Date().getFullYear(),
      month: '',
      title: '',
      coverImageUrl: '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (issue: MagazineIssueAdminDTO) => {
    setEditingIssue(issue);
    setFormData({
      magazineId: issue.magazineId,
      issueNumber: issue.issueNumber,
      year: issue.year,
      month: issue.month || '',
      title: issue.title || '',
      coverImageUrl: issue.coverImageUrl || '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Submit create or edit form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setErrorMessage(null);

    const validation = MagazineIssueInputSchema.safeParse(formData);
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
        if (editingIssue) {
          const res = await updateAdminMagazineIssueAction(editingIssue.id, validation.data);
          if (res.success) {
            setSuccessMessage(`Edición Nº ${validation.data.issueNumber} actualizada con éxito.`);
            setIsModalOpen(false);
            setRefreshKey((k) => k + 1);
          } else {
            setErrorMessage(res.error || 'Error al actualizar edición.');
          }
        } else {
          const res = await createAdminMagazineIssueAction(validation.data);
          if (res.success) {
            setSuccessMessage(`Edición Nº ${validation.data.issueNumber} creada con éxito.`);
            setIsModalOpen(false);
            setRefreshKey((k) => k + 1);
          } else {
            setErrorMessage(res.error || 'Error al crear edición.');
          }
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Error inesperado.');
      }
    });
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (!deletingIssue) return;
    startTransition(async () => {
      try {
        const res = await deleteAdminMagazineIssueAction(deletingIssue.id);
        if (res.success) {
          setSuccessMessage(`Edición Nº ${deletingIssue.issueNumber} eliminada.`);
          setDeletingIssue(null);
          setRefreshKey((k) => k + 1);
        } else {
          setErrorMessage(res.error || 'Error al eliminar edición.');
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Error al eliminar edición.');
      }
    });
  };

  const issueList = useMemo(() => issues, [issues]);

  return (
    <div data-testid="magazine-issue-management-section" className="space-y-6">
      {/* Section Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-[#D2A446]" />
            <h2 className="text-xl font-serif font-bold text-[#1B275E]">
              Gestión de Ediciones (Magazine Issues)
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-sans">
            Administra los números, años, meses, portadas y títulos de las ediciones de cada revista.
          </p>
        </div>

        <Button
          data-testid="magazine-issue-create-btn"
          onClick={handleOpenCreate}
          className="bg-[#1B275E] hover:bg-[#2A3E92] text-white text-xs font-mono uppercase tracking-wider h-9 px-4 rounded-none flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D2A446]" />
          Nueva Edición
        </Button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div
          data-testid="magazine-issue-success-alert"
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
          data-testid="magazine-issue-error-alert"
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

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            data-testid="magazine-issue-search-input"
            type="text"
            placeholder="Buscar por número de edición, título o revista..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs bg-white border-[#CBD5E1] rounded-none h-9 text-[#1B275E]"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            data-testid="magazine-issue-filter-select"
            value={selectedMagazineFilter}
            onChange={(e) => setSelectedMagazineFilter(e.target.value)}
            className="w-full text-xs h-9 px-3 bg-white border border-[#CBD5E1] rounded-none text-[#1B275E] focus:outline-hidden focus:border-[#1B275E]"
          >
            <option value="all">Todas las revistas</option>
            {magazines.map((mag) => (
              <option key={mag.id} value={mag.id}>
                {mag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table / List */}
      <div className="bg-white border border-[#CBD5E1] shadow-xs overflow-x-auto">
        {isLoading ? (
          <div
            data-testid="magazine-issue-loading-state"
            className="p-12 flex flex-col items-center justify-center text-center text-[#64748B]"
          >
            <Loader2 className="w-6 h-6 animate-spin text-[#D2A446] mb-2" />
            <span className="text-xs font-mono">Cargando ediciones...</span>
          </div>
        ) : issueList.length === 0 ? (
          <div
            data-testid="magazine-issue-empty-state"
            className="p-12 text-center text-[#64748B]"
          >
            <p className="text-sm font-serif font-bold text-[#1B275E]">
              No se encontraron ediciones
            </p>
            <p className="text-xs mt-1">
              {search || selectedMagazineFilter !== 'all'
                ? 'Prueba ajustando los filtros de búsqueda.'
                : 'Crea la primera edición pulsando "Nueva Edición".'}
            </p>
          </div>
        ) : (
          <table data-testid="magazine-issues-table" className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0E152E] text-white font-mono uppercase tracking-wider text-[10px] border-b border-[#23356E]">
                <th className="py-3 px-4">Edición</th>
                <th className="py-3 px-4">Revista</th>
                <th className="py-3 px-4">Fecha / Periodo</th>
                <th className="py-3 px-4">Artículos</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {issueList.map((issue) => (
                <tr
                  key={issue.id}
                  data-testid={`magazine-issue-row-${issue.id}`}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-3 px-4 font-serif font-bold text-[#1B275E]">
                    <div className="flex items-center gap-3">
                      {issue.coverImageUrl ? (
                        <div className="w-8 h-10 bg-[#E2E8F0] relative overflow-hidden shrink-0 border border-[#CBD5E1]">
                          <Image
                            src={issue.coverImageUrl}
                            alt={`Nº ${issue.issueNumber}`}
                            fill
                            referrerPolicy="no-referrer"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-10 bg-[#152042] text-[#D2A446] flex items-center justify-center shrink-0">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm flex items-center gap-2">
                          <span>Nº {issue.issueNumber}</span>
                          {issue.title && (
                            <span className="font-sans font-normal text-xs text-[#334155]">
                              — {issue.title}
                            </span>
                          )}
                        </div>
                        {issue.coverImageUrl && (
                          <span className="font-mono font-normal text-[10px] text-[#64748B] block mt-0.5 truncate max-w-xs">
                            {issue.coverImageUrl}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans text-[#1B275E] font-medium">
                    {issue.magazineName}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#475569]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#D2A446]" />
                      <span>
                        {issue.year}
                        {issue.month ? ` (${issue.month})` : ''}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#64748B]">
                    <Badge variant="outline" className="rounded-none border-[#CBD5E1] text-[10px]">
                      {issue.articlesCount ?? 0} artículos
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        data-testid={`magazine-issue-edit-btn-${issue.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(issue)}
                        className="h-8 w-8 p-0 text-[#1B275E] hover:bg-[#E2E8F0] cursor-pointer rounded-none"
                        title="Editar edición"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        data-testid={`magazine-issue-delete-btn-${issue.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingIssue(issue)}
                        className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 cursor-pointer rounded-none"
                        title="Eliminar edición"
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

      {/* Modal Dialog: Create / Edit Magazine Issue */}
      {isModalOpen && (
        <div
          data-testid="magazine-issue-form-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-[#23356E] w-full max-w-lg shadow-2xl p-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <BookMarked className="w-4 h-4 text-[#D2A446]" />
                <h3 className="font-serif font-bold text-base text-[#1B275E]">
                  {editingIssue ? 'Editar Edición de Revista' : 'Nueva Edición de Revista'}
                </h3>
              </div>
              <button
                data-testid="magazine-issue-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#1B275E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Magazine Selection */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#334155] mb-1 font-semibold">
                  Revista *
                </label>
                <select
                  data-testid="magazine-issue-form-magazine-id"
                  required
                  value={formData.magazineId}
                  onChange={(e) => setFormData({ ...formData, magazineId: Number(e.target.value) })}
                  className="w-full text-xs h-9 px-3 bg-white border border-[#CBD5E1] rounded-none text-[#1B275E] focus:outline-hidden focus:border-[#1B275E]"
                >
                  <option value={0} disabled>
                    Selecciona una revista...
                  </option>
                  {magazines.map((mag) => (
                    <option key={mag.id} value={mag.id}>
                      {mag.name} ({mag.publisher || 'Sin editorial'})
                    </option>
                  ))}
                </select>
                {formErrors.magazineId && (
                  <p className="text-[11px] text-rose-600 mt-1 font-sans">{formErrors.magazineId}</p>
                )}
              </div>

              {/* Issue Number & Year */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1 font-semibold">
                    Número de Edición *
                  </label>
                  <Input
                    data-testid="magazine-issue-form-number"
                    type="text"
                    required
                    placeholder="ej. 542, Vol. 12 No. 3..."
                    value={formData.issueNumber}
                    onChange={(e) => setFormData({ ...formData, issueNumber: e.target.value })}
                    className="text-xs rounded-none"
                  />
                  {formErrors.issueNumber && (
                    <p className="text-[11px] text-rose-600 mt-1 font-sans">{formErrors.issueNumber}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1 font-semibold">
                    Año *
                  </label>
                  <Input
                    data-testid="magazine-issue-form-year"
                    type="number"
                    required
                    placeholder="ej. 2026"
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                    className="text-xs font-mono rounded-none"
                  />
                  {formErrors.year && (
                    <p className="text-[11px] text-rose-600 mt-1 font-sans">{formErrors.year}</p>
                  )}
                </div>
              </div>

              {/* Month & Issue Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                    Mes / Periodo
                  </label>
                  <Input
                    data-testid="magazine-issue-form-month"
                    type="text"
                    placeholder="ej. Octubre, Invierno, Q3..."
                    value={formData.month || ''}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="text-xs rounded-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                    Título de la Edición (Opcional)
                  </label>
                  <Input
                    data-testid="magazine-issue-form-title"
                    type="text"
                    placeholder="ej. Especial Ruta de la Seda"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="text-xs rounded-none"
                  />
                </div>
              </div>

              {/* Cover Image URL */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                  URL de la Portada (Cover Image URL)
                </label>
                <Input
                  data-testid="magazine-issue-form-cover-url"
                  type="text"
                  placeholder="ej. /images/mag_altair_silkroad_1791410402139.jpg"
                  value={formData.coverImageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                  className="text-xs font-mono rounded-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
                <Button
                  data-testid="magazine-issue-cancel-btn"
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                  className="text-xs font-mono uppercase rounded-none h-9 px-4 cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  data-testid="magazine-issue-submit-btn"
                  type="submit"
                  disabled={isPending}
                  className="bg-[#1B275E] hover:bg-[#2A3E92] text-white text-xs font-mono uppercase rounded-none h-9 px-4 flex items-center gap-2 cursor-pointer"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingIssue ? 'Guardar Cambios' : 'Crear Edición'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingIssue && (
        <div
          data-testid="magazine-issue-delete-dialog"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-rose-300 w-full max-w-md shadow-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#1B275E]">
                  Eliminar Edición
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  ¿Estás seguro de que deseas eliminar permanentemente la edición{' '}
                  <span className="font-semibold text-[#1B275E]">
                    Nº {deletingIssue.issueNumber} ({deletingIssue.magazineName})
                  </span>
                  ? Esta acción también eliminará todos los artículos asociados a esta edición.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button
                data-testid="magazine-issue-cancel-delete-btn"
                variant="outline"
                size="sm"
                onClick={() => setDeletingIssue(null)}
                disabled={isPending}
                className="text-xs font-mono uppercase rounded-none h-8 px-3 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                data-testid="magazine-issue-confirm-delete-btn"
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
