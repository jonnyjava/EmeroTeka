import React from 'react';
import { getCatalogOverviewAction, searchArticlesAction } from './actions/search.ts';
import { TravelCatalogApp } from '@/src/modules/travel-catalog/presentation/TravelCatalogApp.tsx';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const [overview, initialSearch] = await Promise.all([
    getCatalogOverviewAction(),
    searchArticlesAction({ query: '' }),
  ]);

  return (
    <TravelCatalogApp
      initialMagazines={overview.magazines}
      initialArticles={initialSearch.articles}
      initialDestinations={overview.popularDestinations}
    />
  );
}
