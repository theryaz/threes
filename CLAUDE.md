# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is "Threes with Friends" - a multiplayer implementation of the Threes! puzzle game. It's a full-stack TypeScript application with Vue.js frontend and Node.js/Express backend, supporting both local and online multiplayer gameplay.

## Development Commands

### Quick Start
```bash
# Start all services (client, server, MongoDB, Redis)
docker-compose up

# Client only (port 8080)
cd client-ts && npm start

# Server only (port 4280)
cd server && npm start
```

### Client Commands (client-ts/)
```bash
npm start                    # Dev server on :8080
npm run build:staging        # Build for staging
npm run build:production     # Build for production
npm run lint                 # ESLint
npm run test:unit           # Unit tests (Mocha/Chai)
npm run test:e2e            # E2E tests (Cypress)
npm run deploy:staging      # Build & deploy to staging S3/CloudFront
npm run deploy:production   # Build & deploy to production S3/CloudFront
```

### Server Commands (server/)
```bash
npm start                   # Dev server with nodemon & ts-node
npm run build              # TypeScript compilation
npm run mongo              # Connect to MongoDB shell
./deploy.sh <version>      # Build & push Docker image to ECR
```

### Running Tests
```bash
# Client unit tests
cd client-ts && npm run test:unit

# Client E2E tests
cd client-ts && npm run test:e2e

# No server tests configured yet
```

## Architecture & Key Concepts

### Frontend Architecture (client-ts/)
- **Vue Components**: Game logic in `/src/components/Game/`, especially `Gameboard.vue` and `PlayerGameboard.vue`
- **Vuex Store Modules**:
  - `game.ts`: Single-player game state and logic
  - `multiplayer.ts`: Multiplayer game state, room management
  - `socket.ts`: WebSocket connection management
  - `user.ts`: Authentication and user profile
- **Router Pages**: Home, LocalMultiplayer, Multiplayer in `/src/pages/`
- **API Service**: All HTTP requests go through `/src/services/api.ts`

### Backend Architecture (server/)
- **Game Engine**: Core game logic in `/src/model/game/`
- **Socket.IO Handlers**: Real-time events in `/src/routes/socket/`
- **REST API Routes**: User, game, and player endpoints in `/src/routes/`
- **Authentication**: JWT-based auth in `/src/middleware/requireAuth.ts`
- **Database Models**: Typegoose models in `/src/model/`

### Key Game Concepts
1. **Game Rooms**: Players join rooms via 4-letter codes
2. **Real-time Sync**: Socket.IO broadcasts game state changes
3. **Game States**: Waiting, Playing, GameOver
4. **Player States**: Connected, Disconnected, Spectating
5. **Move Validation**: Server validates all moves before applying

## Environment Configuration

### Local Development
- Client: http://localhost:8080
- Server: http://localhost:4280
- MongoDB: mongodb://mongo/threeswithfriends
- Redis: Default port

### API Endpoints
- Staging: https://api.staging.threeswithfriends.com
- Production: https://api.threeswithfriends.com

Configuration is in `/client-ts/src/model/config.ts`

## Important Technical Details

### WebSocket Events
Key Socket.IO events to understand:
- `join-game`: Player joins a room
- `update-game`: Server broadcasts game state
- `make-move`: Client sends move
- `player-connected/disconnected`: Connection status

### State Management
- Vuex modules use `vuex-module-decorators` for TypeScript support
- Actions are async, mutations are sync
- Socket events update store via actions

### Database Schema
- Users: Email, username, password hash
- Games: Room code, players, game state, moves history
- Players: User reference, game stats

### Deployment
- Frontend: S3 + CloudFront CDN
- Backend: Docker on AWS ECS
- Database: MongoDB Atlas (production)
- Container Registry: AWS ECR

## Common Development Tasks

### Adding a New Game Feature
1. Update game logic in `server/src/model/game/`
2. Add Socket.IO handler in `server/src/routes/socket/`
3. Update Vuex store in `client-ts/src/store/multiplayer.ts`
4. Modify UI components in `client-ts/src/components/Game/`

### Debugging Multiplayer Issues
1. Check browser console for Socket.IO connection
2. Server logs show all socket events (LOG_LEVEL=silly)
3. Use Redux DevTools extension to inspect Vuex state
4. MongoDB queries visible in `docker-compose logs mongo`

### Testing Local Multiplayer
1. Open multiple browser tabs
2. Create game in one tab
3. Join with room code in other tabs
4. Server2 (port 4281) enables LAN testing