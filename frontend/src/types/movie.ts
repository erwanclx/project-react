export const Genre = {
    ACTION: 'Action',
    ADVENTURE: 'Adventure',
    ANIMATION: 'Animation',
    BIOGRAPHY: 'Biography',
    COMEDY: 'Comedy',
    DOCUMENTARY: 'Documentary',
    DRAMA: 'Drama',
    FICTION: 'Fiction',
    FANTASY: 'Fantasy',
    HISTORY: 'History',
    HORROR: 'Horror',
    MUSIC: 'Music',
    POLICE: 'Police',
    ROMANCE: 'Romance',
    SCIFI: 'Sci-Fi',
    THRILLER: 'Thriller',
    WAR: 'War',
    WESTERN: 'Western'
} as const;

export type Genre = typeof Genre[keyof typeof Genre];

export interface Movie {
    id: number | null;
    title: string;
    description: string | null;
    genre: Genre | null;
    duration: number;
    release_date: string; // Format ISO string (YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss)
    image: string | null;
}

/* DTO pour les opérations CRUD */
export type CreateMovieDto = Omit<Movie, 'id'>;

export type UpdateMovieDto = Partial<Omit<Movie, 'id'>> & {
    id: number;
};

export type DeleteMovieDto = {
    id: number;
};

/* Form */

export interface MovieFormData {
    title: string;
    description: string;
    genre: Genre;
    duration: number;
    release_date: Date | string;
    image?: File;
}