import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import MovieManager from '../MovieManager'
import type { Movie } from '../../types/movie'

describe('MovieManager Component', () => {
  const mockMovies: Movie[] = [
    {
      id: 1,
      title: 'Test Movie 1',
      description: 'Description 1',
      genre: 'Action',
      duration: 120,
      release_date: '2024-01-01'
    },
    {
      id: 2,
      title: 'Test Movie 2',
      description: 'Description 2',
      genre: 'Comedy',
      duration: 90,
      release_date: '2024-01-02'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
      ; (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMovies)
      })
  })

  it('renders loading state initially', () => {
    render(<MovieManager />)
    expect(screen.getByText('Chargement des films...')).toBeInTheDocument()
  })

  it('renders error state when API fails', async () => {
    const errorMessage = 'Erreur lors du chargement des films'
      ; (global.fetch as any).mockRejectedValueOnce(new Error(errorMessage))

    render(<MovieManager />)

    await waitFor(() => {
      expect(screen.getByText(`Erreur : ${errorMessage}`)).toBeInTheDocument()
    })
  })

  it('renders movie list after successful fetch', async () => {
    render(<MovieManager />)

    await waitFor(() => {
      expect(screen.getByText('Test Movie 1')).toBeInTheDocument()
      expect(screen.getByText('Test Movie 2')).toBeInTheDocument()
    })
  })

  it('switches to create mode', async () => {
    render(<MovieManager />)

    await waitFor(() => {
      expect(screen.getByText('Liste des films')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'create' } })

    expect(screen.getByText('🟢 Formulaire de création ici')).toBeInTheDocument()
  })

  it('switches to update mode and shows edit form', async () => {
    render(<MovieManager />)

    await waitFor(() => {
      expect(screen.getByText('Liste des films')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'update' } })

    expect(screen.getByText('🟡 Choisissez un film à modifier')).toBeInTheDocument()

    // Click edit button on first movie
    const editButtons = await screen.findAllByText('✏️ Modifier')
    fireEvent.click(editButtons[0])

    expect(screen.getByText('🟡 Modification du film')).toBeInTheDocument()
  })

  it('switches to delete mode and shows confirmation', async () => {
    render(<MovieManager />)

    await waitFor(() => {
      expect(screen.getByText('Liste des films')).toBeInTheDocument()
    })

    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'delete' } })

    expect(screen.getByText('🔴 Choisissez un film à supprimer')).toBeInTheDocument()

    // Click delete button on first movie
    const deleteButtons = await screen.findAllByText('🗑 Supprimer')
    fireEvent.click(deleteButtons[0])

    expect(screen.getByText(/Confirmez-vous la suppression du film/)).toBeInTheDocument()
  })

  it('handles movie deletion', async () => {
    ; (global.fetch as any)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMovies)
      })
      .mockResolvedValueOnce({
        ok: true
      })

    render(<MovieManager />)

    await waitFor(() => {
      expect(screen.getByText('Liste des films')).toBeInTheDocument()
    })

    // Switch to delete mode
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'delete' } })

    // Click delete button and confirm
    const deleteButtons = await screen.findAllByText('🗑 Supprimer')
    fireEvent.click(deleteButtons[0])

    const confirmButton = screen.getByText('✅ Oui, supprimer')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:8002/api/movies/${mockMovies[0].id}`,
        expect.objectContaining({
          method: 'DELETE'
        })
      )
    })
  })

  it('cancels movie deletion', async () => {
    render(<MovieManager />)

    await waitFor(() => {
      expect(screen.getByText('Liste des films')).toBeInTheDocument()
    })

    // Switch to delete mode
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: 'delete' } })

    // Click delete button and cancel
    const deleteButtons = await screen.findAllByText('🗑 Supprimer')
    fireEvent.click(deleteButtons[0])

    const cancelButton = screen.getByText('❌ Annuler')
    fireEvent.click(cancelButton)

    expect(screen.queryByText(/Confirmez-vous la suppression du film/)).not.toBeInTheDocument()
  })
})