# Collaborate to decontaminate

Yet another hackathon submission! This app allows you to chat with other users and make plans with them to save the world!

## Quickstart

0. Setup the [backend](https://github.com/arnu515/collaborate-to-decontaminate-backend.git)

1. Clone this repository

```bash
git clone https://github.com/arnu515/collaborate-to-decontaminate.git frontend

cd frontend
```

2. Set environment variables

```
API_URL=url_of_backend
```

3. Up and away!

```bash
# Install dependencies
npm i # or yarn

# Run the server
npm run dev # or yarn dev

# OR

# Build for production
npm run build
```

Or use docker:

```bash
docker run -dp 3000:3000 -e API_URL=url_of_backend "$(docker build -q .)"
```

Your website will be live on <http://localhost:3000>

Or visit the live version:  
<https://collaboratedecontaminate.gq>
