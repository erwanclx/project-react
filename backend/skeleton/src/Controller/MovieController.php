<?php

namespace App\Controller;

use App\Entity\Movie;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class MovieController extends AbstractController
{
    #[Route('/movies', name: 'api_movies', methods: ['GET'])]
    public function getMovies(EntityManagerInterface $em)
    {
        $movies = $em->getRepository(Movie::class)->findAll();

        $data = array_map(fn(Movie $movie) => [
            'id' => $movie->getId(),
            'title' => $movie->getTitle(),
            'release_date' => $movie->getReleaseDate()->format('c'),
        ], $movies);

        return $this->json($data);
    }

    #[Route('/movies/{id}', name: 'api_movie', methods: ['GET'])]
    public function getMovie(EntityManagerInterface $em, $id)
    {
        $movie = $em->getRepository(Movie::class)->find($id);

        return $this->json($movie);
    }
}
