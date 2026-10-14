'use client';

import React from 'react';
import { LogOut, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminUser } from '../domain/AdminUser';

export interface AdminBlankCanvasProps {
  user: AdminUser;
  onSignOut: () => void;
}

export function AdminBlankCanvas({ user, onSignOut }: AdminBlankCanvasProps) {
  return (
    <div
      data-testid="admin-dashboard-container"
      className="min-h-screen bg-[#F7F9FC] text-[#1B275E] flex flex-col font-sans"
    >
      {/* Top Admin Bar */}
      <header
        data-testid="admin-top-bar"
        className="w-full bg-[#0E152E] text-white border-b border-[#23356E] px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#D2A446]/50 bg-[#152042] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#D2A446]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base tracking-tight text-white">
                Panel de Administración
              </span>
              <Badge
                data-testid="admin-authorized-badge"
                className="bg-[#D2A446]/20 text-[#D2A446] border border-[#D2A446]/40 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-none"
              >
                Autorizado
              </Badge>
            </div>
            <p className="text-[11px] font-mono text-[#9BB0D9]">
              /admin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-right">
            <UserCheck className="w-4 h-4 text-[#9BB0D9]" />
            <div className="text-xs">
              <span
                data-testid="admin-user-email"
                className="font-mono text-white text-[11px] block"
              >
                {user.email}
              </span>
            </div>
          </div>

          <Button
            data-testid="admin-signout-btn"
            variant="outline"
            size="sm"
            onClick={onSignOut}
            className="border-[#374C8A] bg-[#152042] hover:bg-[#1E2D64] text-white text-xs font-mono uppercase tracking-wider flex items-center gap-1.5 cursor-pointer rounded-none h-8 px-3"
          >
            <LogOut className="w-3.5 h-3.5 text-[#D2A446]" />
            <span>Cerrar sesión</span>
          </Button>
        </div>
      </header>

      {/* Blank Workspace Canvas */}
      <main
        data-testid="admin-blank-canvas"
        className="flex-1 p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col"
      >
        <div className="border border-dashed border-[#CBD5E1] bg-white p-12 md:p-16 flex-1 flex flex-col items-center justify-center text-center shadow-xs">
          <div className="w-12 h-12 border border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-center mb-4">
            <span className="font-mono text-xs text-[#94A3B8]">/</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#1B275E] mb-2">
            Área de Gestión
          </h2>
          <p className="text-xs text-[#64748B] max-w-md font-sans leading-relaxed">
            Página en blanco de administración. Tu sesión como <span className="font-mono font-medium text-[#1B275E]">{user.email}</span> ha sido verificada satisfactoriamente.
          </p>
        </div>
      </main>
    </div>
  );
}
