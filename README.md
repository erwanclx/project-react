# project-react
## How to run project locally ?

Copy .env.sample to .env and populate the values.

### Frontend

```bash
cd frontend
npm install
```

### Backend

```bash
cd backend
```


## How to build the project ?

### Frontend

```bash
cd frontend
npm run build
```

### Backend

```bash
cd backend
```

### Database
Generate and run migs

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
php bin/console doctrine:schema:update --force (uniquement si conflit)
```