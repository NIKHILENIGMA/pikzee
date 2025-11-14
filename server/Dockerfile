FROM node:22-alpine

# Install bash (required for devcontainer features)
RUN apk add --no-cache bash

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Change ownership to node user
RUN chown -R node:node /app

# Switch to node user
USER node

COPY --chown=node:node package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY --chown=node:node . .

EXPOSE 5000

CMD ["pnpm", "run", "dev"]