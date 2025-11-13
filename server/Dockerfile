FROM node:22-alpine

# Install bash (required for devcontainer features)
RUN apk add --no-cache bash

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN pnpm install

COPY . .

EXPOSE 5000

CMD ["pnpm", "run", "dev"]