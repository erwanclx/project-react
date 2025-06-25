import {useEffect, useState} from 'react'
import './App.css'
import type {Movie} from '../types/movie.ts';
import TableActions from './components/TableActions';
import MovieTable from './components/MovieTable';

function App() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [filters, setFilters] = useState<Record<string, string>>({});

    useEffect(() => {
        fetch('/api/movies')
            .then((res) => res.json())
            .then(setMovies)
            .catch(console.error);
    }, []);

    const filteredMovies = movies.filter((movie) => {
        return Object.entries(filters).every(([key, value]) => {
            if (!value) return true;
            const typedKey = key as keyof Movie;
            const field = movie[typedKey];
            return field?.toString().toLowerCase().includes(value.toLowerCase());
        });
    });

    return (
        <>
            <div className="app-container">
                <h1 className="page-title">Films de la filmothèque</h1>

                <TableActions
                    filters={filters}
                    onFilterChange={(field, value) =>
                        setFilters((prev) => ({...prev, [field]: value}))
                    }
                    onAddMovie={() => alert('Ajouter un film')}
                />

                <MovieTable movies={filteredMovies}/>
            </div>
        </>
    );
}

export default App
