<?php

namespace App\Controller;

use App\Entity\Movie;
use App\Enum\Genre;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

class MovieController extends AbstractController
{
    private function movieToArray(Movie $movie): array
    {
        return [
            'id' => $movie->getId(),
            'title' => $movie->getTitle(),
            'description' => $movie->getDescription(),
            'genre' => $movie->getGenre()?->value,
            'duration' => $movie->getDuration(),
            'release_date' => $movie->getReleaseDate()->format('c'),
            'image' => $movie->getImage(),
        ];
    }
    #[Route('/movies', name: 'api_movies', methods: ['GET'])]
    public function getMovies(EntityManagerInterface $em): JsonResponse
    {
        $movies = $em->getRepository(Movie::class)->findAll();

        $data = array_map(fn(Movie $movie) => [
            'id' => $movie->getId(),
            'title' => $movie->getTitle(),
            'description' => $movie->getDescription(),
            'genre' => $movie->getGenre()?->value,
            'duration' => $movie->getDuration(),
            'release_date' => $movie->getReleaseDate()->format('c'),
            'image' => $movie->getImage(),
        ], $movies);

        return $this->json($data);
    }

    #[Route('/movies/{id}', name: 'api_movie', methods: ['GET'])]
    public function getMovie(EntityManagerInterface $em, $id): JsonResponse
    {
        $movie = $em->getRepository(Movie::class)->find($id);

        if (!$movie) {
            return $this->json(['error' => 'Movie not found'], Response::HTTP_NOT_FOUND);
        }

        return $this->json([
            'id' => $movie->getId(),
            'title' => $movie->getTitle(),
            'description' => $movie->getDescription(),
            'genre' => $movie->getGenre()?->value,
            'duration' => $movie->getDuration(),
            'release_date' => $movie->getReleaseDate()->format('c'),
        ]);
    }

    #[Route('/movies', name: 'api_movie_create', methods: ['POST'])]
    public function createMovie(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        $data = json_decode($request->request->get('data'), true);

        if (!isset($data['title'], $data['genre'], $data['release_date'], $data['duration'])) {
            return $this->json(['error' => 'Missing required fields'], Response::HTTP_BAD_REQUEST);
        }

        if (!Genre::tryFrom($data['genre'])) {
            return $this->json(['error' => 'Invalid genre value'], Response::HTTP_BAD_REQUEST);
        }

        $movie = new Movie();
        $movie->setTitle($data['title'])
            ->setDescription($data['description'] ?? null)
            ->setGenre(Genre::from($data['genre']))
            ->setDuration((int)$data['duration'])
            ->setReleaseDate(new \DateTime($data['release_date']));

        $imageFile = $request->files->get('image');
        if ($imageFile) {
            $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
            $safeFilename = $slugger->slug($originalFilename);
            $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

            try {
                $imageFile->move(
                    $this->getParameter('movie_images_directory'),
                    $newFilename
                );
                $movie->setImage($newFilename);
            } catch (\Exception $e) {
                return $this->json(['error' => 'Error uploading image'], Response::HTTP_INTERNAL_SERVER_ERROR);
            }
        }

        $em->persist($movie);
        $em->flush();

        return $this->json($this->movieToArray($movie), Response::HTTP_CREATED);
    }

    #[Route('/movies/{id}', name: 'api_movie_update', methods: ['PUT', 'POST'])]
    public function updateMovie(Request $request, EntityManagerInterface $em, SluggerInterface $slugger, $id): JsonResponse
    {
        $movie = $em->getRepository(Movie::class)->find($id);
        if (!$movie) {
            return $this->json(['error' => 'Movie not found'], Response::HTTP_NOT_FOUND);
        }

        if ($request->getMethod() === 'POST') {
            $data = json_decode($request->request->get('data'), true);

            $imageFile = $request->files->get('image');
            if ($imageFile) {
                if ($movie->getImage()) {
                    $oldImagePath = $this->getParameter('movie_images_directory') . '/' . $movie->getImage();
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename . '-' . uniqid() . '.' . $imageFile->guessExtension();

                try {
                    $imageFile->move(
                        $this->getParameter('movie_images_directory'),
                        $newFilename
                    );
                    $movie->setImage($newFilename);
                } catch (\Exception $e) {
                    return $this->json(['error' => 'Error uploading image'], Response::HTTP_INTERNAL_SERVER_ERROR);
                }
            }
        } else {
            $data = json_decode($request->getContent(), true);
        }

        if (isset($data['title'])) {
            $movie->setTitle($data['title']);
        }

        if (isset($data['description'])) {
            $movie->setDescription($data['description']);
        }

        if (isset($data['genre'])) {
            $genre = Genre::tryFrom($data['genre']);
            if (!$genre) {
                return $this->json(['error' => 'Invalid genre value'], Response::HTTP_BAD_REQUEST);
            }
            $movie->setGenre($genre);
        }

        if (isset($data['duration'])) {
            $movie->setDuration((int)$data['duration']);
        }

        if (isset($data['release_date'])) {
            $movie->setReleaseDate(new \DateTime($data['release_date']));
        }

        $em->flush();

        return $this->json($this->movieToArray($movie), Response::HTTP_OK);
    }

    #[Route('/movies/{id}', name: 'api_movie_delete', methods: ['DELETE'])]
    public function deleteMovie(EntityManagerInterface $em, $id): JsonResponse
    {
        $movie = $em->getRepository(Movie::class)->find($id);
        if (!$movie) {
            return $this->json(['error' => 'Movie not found'], Response::HTTP_NOT_FOUND);
        }

        $em->remove($movie);
        $em->flush();

        return $this->json(['message' => 'Movie deleted']);
    }

    #[Route('/genres', name: 'api_movie_genres', methods: ['GET'])]
    public function getMovieGenres(): JsonResponse
    {
        $genres = array_map(fn(Genre $genre) => $genre->value, Genre::cases());
        return $this->json($genres);
    }
}
