'use client';

import React, { useState } from 'react';
import { BookOpen, FileText, LogOut, ShieldCheck, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminUser } from '@/src/modules/admin-auth/domain/AdminUser';
import { MagazineManagementSection } from './MagazineManagementSection';
import { ArticleManagementSection } from './ArticleManagementSection';

export interface AdminDashboardProps {
  user: AdminUser;
  onSignOut: () => void;
}

export type AdminTab = 'magazines' | 'articles';

export function AdminDashboard({ user, onSignOut }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('magazines');

  return (
    <div
      data-testid="admin-dashboard-container"
      className="min-h-screen bg-[#F7F9FC] text-[#1B275E] flex flex-col font-sans"
    >
      {/* Top Admin Header Bar */}
      <header
        data-testid="admin-top-bar"
        className="w-full bg-[#0E152E] text-white border-b border-[#23356E] px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border border-[#D2A446]/50 bg-[#152042] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#D2A446]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-base tracking-tight text-white">
                Panel de Control Editorial
              </span>
              <Badge
                data-testid="admin-authorized-badge"
                className="bg-[#D2A446]/20 text-[#D2A446] border border-[#D2A446]/40 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-none"
              >
                Autorizado
              </Badge>
            </div>
            <p className="text-[11px] font-mono text-[#9BB0D9]">
              /admin · Sistema Central
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

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 flex flex-col space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-[#CBD5E1] gap-1">
          <button
            data-testid="admin-tab-magazines"
            onClick={() => setActiveTab('magazines')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-wider border-b-2 font-bold cursor-pointer transition-colors ${
              activeTab === 'magazines'
                ? 'border-[#1B275E] text-[#1B275E] bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#1B275E] hover:bg-[#F1F5F9]'
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#D2A446]" />
            <span>Revistas (Magazines)</span>
          </button>

          <button
            data-testid="admin-tab-articles"
            onClick={() => setActiveTab('articles')}
            className={`flex items-center gap-2 px-5 py-3 text-xs font-mono uppercase tracking-wider border-b-2 font-bold cursor-pointer transition-colors ${
              activeTab === 'articles'
                ? 'border-[#1B275E] text-[#1B275E] bg-white'
                : 'border-transparent text-[#64748B] hover:text-[#1B275E] hover:bg-[#F1F5F9]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#D2A446]" />
            <span>Artículos (Articles)</span>
          </button>
        </div>

        {/* Tab Panels */}
        <div className="flex-1">
          {activeTab === 'magazines' && <MagazineManagementSection />}
          {activeTab === 'articles' && <ArticleManagementSection />}
        </div>
      </main>
    </div>
  );
}
