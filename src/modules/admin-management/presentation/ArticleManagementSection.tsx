'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  AlertTriangle,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  ArticleAdminDTO,
  ArticleInput,
  ArticleInputSchema,
  MagazineIssueOptionDTO,
} from '../domain/ArticleAdminEntity';
import { MagazineAdminDTO } from '../domain/MagazineAdminEntity';
import {
  getAdminArticlesAction,
  getAdminMagazinesAction,
  getAdminIssueOptionsAction,
  getAdminTagsAction,
  createAdminArticleAction,
  updateAdminArticleAction,
  deleteAdminArticleAction,
} from '@/app/actions/admin';

export function ArticleManagementSection() {
  const [articles, setArticles] = useState<ArticleAdminDTO[]>([]);
  const [magazines, setMagazines] = useState<MagazineAdminDTO[]>([]);
  const [issueOptions, setIssueOptions] = useState<MagazineIssueOptionDTO[]>([]);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [selectedMagazineId, setSelectedMagazineId] = useState<number | undefined>(undefined);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<ArticleAdminDTO | null>(null);
  const [deletingArticle, setDeletingArticle] = useState<ArticleAdminDTO | null>(null);

  // Form states
  const [formData, setFormData] = useState<ArticleInput>({
    magazineId: 0,
    issueId: 0,
    title: '',
    subtitle: '',
    author: '',
    startPage: 1,
    endPage: 10,
    synopsis: '',
    tags: '',
    featured: false,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [refreshKey, setRefreshKey] = useState(0);

  // Tags state for autocomplete
  const [existingTags, setExistingTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [showTagSuggestions, setShowTagSuggestions] = useState(false);

  useEffect(() => {
    let ignore = false;
    async function loadTags() {
      try {
        const res = await getAdminTagsAction();
        if (!ignore && res.success && res.data) {
          setExistingTags(res.data);
        }
      } catch (err) {
        console.error('Failed to load tags:', err);
      }
    }
    loadTags();
    return () => {
      ignore = true;
    };
  }, [refreshKey, isModalOpen]);

  const filteredTagSuggestions = useMemo(() => {
    const currentTags = (formData.tags || '')
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const query = tagInput.trim().toLowerCase();
    if (!query) return existingTags.filter((t) => !currentTags.includes(t.toLowerCase())).slice(0, 8);

    return existingTags
      .filter(
        (t) =>
          t.toLowerCase().includes(query) &&
          !currentTags.includes(t.toLowerCase())
      )
      .slice(0, 8);
  }, [existingTags, formData.tags, tagInput]);

  const handleSelectTagSuggestion = (tagName: string) => {
    const currentTags = (formData.tags || '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    if (!currentTags.map((t) => t.toLowerCase()).includes(tagName.toLowerCase())) {
      currentTags.push(tagName);
      setFormData({ ...formData, tags: currentTags.join(', ') });
    }
    setTagInput('');
    setShowTagSuggestions(false);
  };


  // Initial load for magazines and issue options
  useEffect(() => {
    let ignore = false;
    async function loadMetadata() {
      try {
        const [magRes, issueRes] = await Promise.all([
          getAdminMagazinesAction(),
          getAdminIssueOptionsAction(),
        ]);
        if (!ignore) {
          if (magRes.success && magRes.data) {
            setMagazines(magRes.data);
          }
          if (issueRes.success && issueRes.data) {
            setIssueOptions(issueRes.data);
          }
        }
      } catch (err: unknown) {
        console.error('Failed to load metadata options:', err);
      }
    }
    loadMetadata();
    return () => {
      ignore = true;
    };
  }, []);

  // Load articles
  useEffect(() => {
    let ignore = false;
    async function fetchArticles() {
      try {
        const res = await getAdminArticlesAction({
          search: search || undefined,
          magazineId: selectedMagazineId,
        });
        if (!ignore) {
          if (res.success && res.data) {
            setArticles(res.data);
          } else {
            setErrorMessage(res.error || 'Error al cargar artículos.');
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

    fetchArticles();
    return () => {
      ignore = true;
    };
  }, [search, selectedMagazineId, refreshKey]);

  // Filtered issue options based on selected magazine in modal form
  const availableIssuesForForm = useMemo(() => {
    if (!formData.magazineId) return issueOptions;
    return issueOptions.filter((opt) => opt.magazineId === formData.magazineId);
  }, [issueOptions, formData.magazineId]);

  // Open Create Modal
  const handleOpenCreate = () => {
    const defaultMag = magazines[0]?.id || 0;
    const defaultIssue = issueOptions.find((i) => i.magazineId === defaultMag)?.id || 0;

    setEditingArticle(null);
    setFormData({
      magazineId: defaultMag,
      issueId: defaultIssue,
      title: '',
      subtitle: '',
      author: '',
      startPage: 1,
      endPage: 10,
      synopsis: '',
      tags: '',
      featured: false,
    });
    setTagInput('');
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (art: ArticleAdminDTO) => {
    setEditingArticle(art);
    setFormData({
      magazineId: art.magazineId,
      issueId: art.issueId,
      title: art.title,
      subtitle: art.subtitle || '',
      author: art.author || '',
      startPage: art.startPage,
      endPage: art.endPage,
      synopsis: art.synopsis,
      tags: art.tags || '',
      featured: Boolean(art.featured),
    });
    setTagInput(art.tags || '');
    setFormErrors({});
    setIsModalOpen(true);
  };

  // Handle magazine change in form
  const handleFormMagazineChange = (magId: number) => {
    const matchingIssues = issueOptions.filter((i) => i.magazineId === magId);
    const newIssueId = matchingIssues[0]?.id || 0;
    setFormData((prev) => ({
      ...prev,
      magazineId: magId,
      issueId: newIssueId,
    }));
  };

  // Submit create or edit form
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setErrorMessage(null);

    const validation = ArticleInputSchema.safeParse(formData);
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
        if (editingArticle) {
          const res = await updateAdminArticleAction(editingArticle.id, validation.data);
          if (res.success) {
            setSuccessMessage(`Artículo "${validation.data.title}" actualizado con éxito.`);
            setIsModalOpen(false);
            setRefreshKey((k) => k + 1);
          } else {
            setErrorMessage(res.error || 'Error al actualizar artículo.');
          }
        } else {
          const res = await createAdminArticleAction(validation.data);
          if (res.success) {
            setSuccessMessage(`Artículo "${validation.data.title}" creado con éxito.`);
            setIsModalOpen(false);
            setRefreshKey((k) => k + 1);
          } else {
            setErrorMessage(res.error || 'Error al crear artículo.');
          }
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Error inesperado.');
      }
    });
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    if (!deletingArticle) return;
    startTransition(async () => {
      try {
        const res = await deleteAdminArticleAction(deletingArticle.id);
        if (res.success) {
          setSuccessMessage(`Artículo "${deletingArticle.title}" eliminado.`);
          setDeletingArticle(null);
          setRefreshKey((k) => k + 1);
        } else {
          setErrorMessage(res.error || 'Error al eliminar artículo.');
        }
      } catch (err: unknown) {
        setErrorMessage(err instanceof Error ? err.message : 'Error al eliminar artículo.');
      }
    });
  };

  return (
    <div data-testid="article-management-section" className="space-y-6">
      {/* Section Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D2A446]" />
            <h2 className="text-xl font-serif font-bold text-[#1B275E]">
              Gestión de Artículos
            </h2>
          </div>
          <p className="text-xs text-[#64748B] mt-1 font-sans">
            Crea, edita y administra los artículos indexados por publicación y rango de páginas.
          </p>
        </div>

        <Button
          data-testid="article-create-btn"
          onClick={handleOpenCreate}
          className="bg-[#1B275E] hover:bg-[#2A3E92] text-white text-xs font-mono uppercase tracking-wider h-9 px-4 rounded-none flex items-center gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#D2A446]" />
          Nuevo Artículo
        </Button>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div
          data-testid="article-success-alert"
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
          data-testid="article-error-alert"
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <Input
            data-testid="article-search-input"
            type="text"
            placeholder="Buscar artículos por título, autor o temática..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs bg-white border-[#CBD5E1] rounded-none h-9 text-[#1B275E]"
          />
        </div>

        <select
          data-testid="article-filter-magazine"
          value={selectedMagazineId || ''}
          onChange={(e) => setSelectedMagazineId(e.target.value ? Number(e.target.value) : undefined)}
          className="text-xs bg-white border border-[#CBD5E1] px-3 py-2 rounded-none h-9 text-[#1B275E] cursor-pointer"
        >
          <option value="">Todas las Revistas</option>
          {magazines.map((m) => (
            <option key={m.id} value={m.id}>
              {m.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table / List */}
      <div className="bg-white border border-[#CBD5E1] shadow-xs overflow-x-auto">
        {isLoading ? (
          <div
            data-testid="article-loading-state"
            className="p-12 flex flex-col items-center justify-center text-center text-[#64748B]"
          >
            <Loader2 className="w-6 h-6 animate-spin text-[#D2A446] mb-2" />
            <span className="text-xs font-mono">Cargando catálogo de artículos...</span>
          </div>
        ) : articles.length === 0 ? (
          <div
            data-testid="article-empty-state"
            className="p-12 text-center text-[#64748B]"
          >
            <p className="text-sm font-serif font-bold text-[#1B275E]">
              No se encontraron artículos
            </p>
            <p className="text-xs mt-1">
              {search || selectedMagazineId
                ? 'Intenta con otros filtros de búsqueda.'
                : 'Crea el primer artículo pulsando "Nuevo Artículo".'}
            </p>
          </div>
        ) : (
          <table data-testid="articles-table" className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#0E152E] text-white font-mono uppercase tracking-wider text-[10px] border-b border-[#23356E]">
                <th className="py-3 px-4">Artículo</th>
                <th className="py-3 px-4">Publicación & Edición</th>
                <th className="py-3 px-4">Sinopsis</th>
                <th className="py-3 px-4">Páginas</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {articles.map((art) => (
                <tr
                  key={art.id}
                  data-testid={`article-row-${art.id}`}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-[#1B275E] text-sm">
                          {art.title}
                        </span>
                        {art.featured && (
                          <Badge
                            data-testid={`article-featured-badge-${art.id}`}
                            className="bg-[#D2A446]/20 text-[#9E731B] border border-[#D2A446]/40 text-[9px] font-mono px-1.5 py-0 rounded-none flex items-center gap-1"
                          >
                            <Sparkles className="w-2.5 h-2.5" /> Destacado
                          </Badge>
                        )}
                      </div>
                      {art.subtitle && (
                        <span className="text-[11px] text-[#64748B] italic mt-0.5 line-clamp-1">
                          {art.subtitle}
                        </span>
                      )}
                      {art.author && (
                        <span className="text-[10px] font-mono text-[#94A3B8] mt-1">
                          Por {art.author}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#334155]">
                    <div className="font-semibold text-[#1B275E]">{art.magazineName}</div>
                    <div className="text-[11px] text-[#64748B] font-mono">
                      Nº {art.issueNumber} ({art.issueYear}
                      {art.issueMonth ? ` · ${art.issueMonth}` : ''})
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-xs">
                    <p className="text-xs text-[#475569] line-clamp-2">{art.synopsis}</p>
                    {art.tags && (
                      <span className="text-[10px] font-mono text-[#94A3B8] block mt-1">
                        {art.tags}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#475569]">
                    págs. {art.startPage}–{art.endPage}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        data-testid={`article-edit-btn-${art.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEdit(art)}
                        className="h-8 w-8 p-0 text-[#1B275E] hover:bg-[#E2E8F0] cursor-pointer rounded-none"
                        title="Editar artículo"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        data-testid={`article-delete-btn-${art.id}`}
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingArticle(art)}
                        className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-50 cursor-pointer rounded-none"
                        title="Eliminar artículo"
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

      {/* Modal Dialog: Create / Edit Article */}
      {isModalOpen && (
        <div
          data-testid="article-form-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white border border-[#23356E] w-full max-w-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D2A446]" />
                <h3 className="font-serif font-bold text-base text-[#1B275E]">
                  {editingArticle ? 'Editar Artículo' : 'Nuevo Artículo'}
                </h3>
              </div>
              <button
                data-testid="article-modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                className="text-[#64748B] hover:text-[#1B275E] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Publication Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1 font-semibold">
                    Revista de Origen *
                  </label>
                  <select
                    data-testid="article-form-magazine-select"
                    required
                    value={formData.magazineId || ''}
                    onChange={(e) => handleFormMagazineChange(Number(e.target.value))}
                    className="w-full text-xs bg-white border border-[#CBD5E1] p-2 rounded-none text-[#1B275E]"
                  >
                    <option value="" disabled>
                      Selecciona una revista...
                    </option>
                    {magazines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.magazineId && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.magazineId}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1 font-semibold">
                    Edición / Issue *
                  </label>
                  <select
                    data-testid="article-form-issue-select"
                    required
                    value={formData.issueId || ''}
                    onChange={(e) => setFormData({ ...formData, issueId: Number(e.target.value) })}
                    className="w-full text-xs bg-white border border-[#CBD5E1] p-2 rounded-none text-[#1B275E]"
                  >
                    <option value="" disabled>
                      Selecciona una edición...
                    </option>
                    {availableIssuesForForm.map((iss) => (
                      <option key={iss.id} value={iss.id}>
                        {iss.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.issueId && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.issueId}</p>
                  )}
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#334155] mb-1 font-semibold">
                  Título del Artículo *
                </label>
                <Input
                  data-testid="article-form-title"
                  type="text"
                  required
                  placeholder="ej. En Busca de los Jardines Perdidos de Babilonia"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="text-xs rounded-none"
                />
                {formErrors.title && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                  Subtítulo / Bajada
                </label>
                <Input
                  data-testid="article-form-subtitle"
                  type="text"
                  placeholder="ej. Nuevas excavaciones a orillas del río Éufrates"
                  value={formData.subtitle || ''}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="text-xs rounded-none"
                />
              </div>

              {/* Authorship & Pages */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                    Autor / Redactor
                  </label>
                  <Input
                    data-testid="article-form-author"
                    type="text"
                    placeholder="ej. Paul Theroux"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="text-xs rounded-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                    Pág. Inicio *
                  </label>
                  <Input
                    data-testid="article-form-start-page"
                    type="number"
                    min={1}
                    required
                    value={formData.startPage}
                    onChange={(e) => setFormData({ ...formData, startPage: Number(e.target.value) })}
                    className="text-xs font-mono rounded-none"
                  />
                  {formErrors.startPage && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.startPage}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                    Pág. Fin *
                  </label>
                  <Input
                    data-testid="article-form-end-page"
                    type="number"
                    min={1}
                    required
                    value={formData.endPage}
                    onChange={(e) => setFormData({ ...formData, endPage: Number(e.target.value) })}
                    className="text-xs font-mono rounded-none"
                  />
                  {formErrors.endPage && (
                    <p className="text-[11px] text-rose-600 mt-1">{formErrors.endPage}</p>
                  )}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <label className="block text-xs font-mono uppercase text-[#334155] mb-1 font-semibold">
                  Sinopsis / Resumen *
                </label>
                <textarea
                  data-testid="article-form-synopsis"
                  required
                  rows={3}
                  placeholder="Resumen del reportaje, descubrimientos, rutas o cronología documental..."
                  value={formData.synopsis}
                  onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                  className="w-full text-xs p-2 border border-[#CBD5E1] rounded-none focus:outline-hidden focus:border-[#1B275E] text-[#1B275E]"
                />
                {formErrors.synopsis && (
                  <p className="text-[11px] text-rose-600 mt-1">{formErrors.synopsis}</p>
                )}
              </div>

              {/* Tags & Featured */}
              <div className="relative">
                <label className="block text-xs font-mono uppercase text-[#334155] mb-1">
                  Etiquetas / Tags (escribe para buscar existentes o añadir nuevas)
                </label>
                <Input
                  data-testid="article-form-tags"
                  type="text"
                  placeholder="ej. expedición, historia, arqueología"
                  value={tagInput}
                  onChange={(e) => {
                    setTagInput(e.target.value);
                    setShowTagSuggestions(true);
                    setFormData({ ...formData, tags: e.target.value });
                  }}
                  onFocus={() => setShowTagSuggestions(true)}
                  onBlur={() => {
                    setTimeout(() => setShowTagSuggestions(false), 200);
                  }}
                  className="text-xs rounded-none"
                />
                {formData.tags && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.tags
                      .split(',')
                      .map((t) => t.trim())
                      .filter(Boolean)
                      .map((t, idx) => (
                        <span
                          key={idx}
                          className="bg-[#1B275E]/10 text-[#1B275E] text-[10px] font-mono px-2 py-0.5 flex items-center gap-1 border border-[#1B275E]/20"
                        >
                          {t}
                          <button
                            type="button"
                            onClick={() => {
                              const updated = formData.tags
                                ? formData.tags
                                    .split(',')
                                    .map((s) => s.trim())
                                    .filter((s) => s.toLowerCase() !== t.toLowerCase())
                                    .join(', ')
                                : '';
                              setFormData({ ...formData, tags: updated });
                              setTagInput(updated);
                            }}
                            className="hover:text-rose-600 ml-0.5 cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                  </div>
                )}
                {showTagSuggestions && filteredTagSuggestions.length > 0 && (
                  <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-[#CBD5E1] shadow-xl max-h-44 overflow-y-auto">
                    <div className="p-1.5 text-[10px] font-mono text-[#64748B] border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      Etiquetas existentes (haz clic para usar):
                    </div>
                    {filteredTagSuggestions.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          handleSelectTagSuggestion(tag);
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-[#1B275E] hover:bg-[#E2E8F0] font-mono cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <span className="font-medium">{tag}</span>
                        <span className="text-[10px] text-[#9E731B] bg-[#D2A446]/10 px-1.5 py-0.5">
                          Existente
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  data-testid="article-form-featured"
                  type="checkbox"
                  id="featured-checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded-none border-[#CBD5E1] text-[#D2A446] focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <label
                  htmlFor="featured-checkbox"
                  className="text-xs text-[#1B275E] font-medium cursor-pointer"
                >
                  Marcar como artículo destacado (se muestra prioritario en portada)
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#E2E8F0]">
                <Button
                  data-testid="article-cancel-btn"
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isPending}
                  className="text-xs font-mono uppercase rounded-none h-9 px-4 cursor-pointer"
                >
                  Cancelar
                </Button>
                <Button
                  data-testid="article-submit-btn"
                  type="submit"
                  disabled={isPending}
                  className="bg-[#1B275E] hover:bg-[#2A3E92] text-white text-xs font-mono uppercase rounded-none h-9 px-4 flex items-center gap-2 cursor-pointer"
                >
                  {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingArticle ? 'Guardar Cambios' : 'Crear Artículo'}</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingArticle && (
        <div
          data-testid="article-delete-dialog"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-rose-300 w-full max-w-md shadow-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#1B275E]">
                  Eliminar Artículo
                </h3>
                <p className="text-xs text-[#64748B] mt-1">
                  ¿Estás seguro de que deseas eliminar permanentemente{' '}
                  <span className="font-semibold text-[#1B275E]">
                    &quot;{deletingArticle.title}&quot;
                  </span>
                  ? Esta acción no se puede deshacer.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E2E8F0]">
              <Button
                data-testid="article-cancel-delete-btn"
                variant="outline"
                size="sm"
                onClick={() => setDeletingArticle(null)}
                disabled={isPending}
                className="text-xs font-mono uppercase rounded-none h-8 px-3 cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                data-testid="article-confirm-delete-btn"
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
