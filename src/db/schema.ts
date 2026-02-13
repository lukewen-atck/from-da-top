
import { pgTable, text, serial, integer, boolean, timestamp } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
    uid: text('uid').primaryKey(),
    has_rerolled: boolean('has_rerolled').default(false).notNull(),
    selected_song_id: integer('selected_song_id'),
    name: text('name'),
    instagram: text('instagram'),
    note: text('note'),
    created_at: timestamp('created_at').defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one }) => ({
    selectedSong: one(songs, {
        fields: [users.selected_song_id],
        references: [songs.id],
    }),
}));

export const songs = pgTable('songs', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    artist: text('artist').notNull(),
    year: text('year'),
    tempo: text('tempo').notNull(),
    vocal: text('vocal').notNull(),
    albumArt: text('album_art'),
    preview_url: text('preview_url'),

    // Status
    is_taken: boolean('is_taken').default(false).notNull(),
    taken_by: text('taken_by').references(() => users.uid),
});

export const songsRelations = relations(songs, ({ one }) => ({
    takenBy: one(users, {
        fields: [songs.taken_by],
        references: [users.uid],
    }),
}));
