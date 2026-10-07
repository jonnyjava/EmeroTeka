import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Mandatory users table for Cloud SQL and Firebase Auth linkage
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Travel Magazines
export const magazines = pgTable('magazines', {
  id: serial('id').primaryKey(),
  name: text('name').notNull().unique(),
  publisher: text('publisher'),
  country: text('country'),
  issn: text('issn'),
  description: text('description'),
  coverImageUrl: text('cover_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Issues of Magazines (Year, Issue Number, Month, Volume)
export const magazineIssues = pgTable('magazine_issues', {
  id: serial('id').primaryKey(),
  magazineId: integer('magazine_id')
    .references(() => magazines.id, { onDelete: 'cascade' })
    .notNull(),
  issueNumber: text('issue_number').notNull(),
  year: integer('year').notNull(),
  month: text('month'),
  volume: text('volume'),
  title: text('title'),
  coverImageUrl: text('cover_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Articles indexed by location, page range, issue, and magazine
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  magazineId: integer('magazine_id')
    .references(() => magazines.id, { onDelete: 'cascade' })
    .notNull(),
  issueId: integer('issue_id')
    .references(() => magazineIssues.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  subtitle: text('subtitle'),
  author: text('author'),
  photographer: text('photographer'),
  startPage: integer('start_page').notNull(),
  endPage: integer('end_page').notNull(),
  // Location indexing fields
  city: text('city'),
  region: text('region'),
  country: text('country').notNull(),
  locationSearchIndex: text('location_search_index').notNull(),
  synopsis: text('synopsis').notNull(),
  tags: text('tags'),
  featured: boolean('featured').default(false),
  coverImageUrl: text('cover_image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relational Mappings
export const magazinesRelations = relations(magazines, ({ many }) => ({
  issues: many(magazineIssues),
  articles: many(articles),
}));

export const magazineIssuesRelations = relations(magazineIssues, ({ one, many }) => ({
  magazine: one(magazines, {
    fields: [magazineIssues.magazineId],
    references: [magazines.id],
  }),
  articles: many(articles),
}));

export const articlesRelations = relations(articles, ({ one }) => ({
  issue: one(magazineIssues, {
    fields: [articles.issueId],
    references: [magazineIssues.id],
  }),
  magazine: one(magazines, {
    fields: [articles.magazineId],
    references: [magazines.id],
  }),
}));
