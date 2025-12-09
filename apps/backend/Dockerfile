FROM node:lts-alpine

RUN mkdir -p /app && chown -R node:node /app

WORKDIR /app

COPY --chown=node:node apps/backend/package.json apps/backend/tsconfig.json ./
COPY --chown=node:node apps/backend/src ./src

USER node

RUN npm install

ARG PORT
EXPOSE ${PORT}

RUN npm run build

CMD ["npm", "run", "start"]