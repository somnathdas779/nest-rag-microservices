FROM node:20-alpine AS builder

# Redeclare after FROM (scope resets after FROM)
ARG APP_NAME
RUN echo "Building app: $APP_NAME"

WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy source
COPY tsconfig*.json nest-cli.json ./
COPY apps ./apps
COPY libs ./libs

# Build  service
RUN npx nest build $APP_NAME
RUN npm run postbuild

# ================================


FROM node:20-alpine AS runner
WORKDIR /app
ARG APP_NAME
ENV APP_NAME=$APP_NAME

# Copy only the build output and production deps
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --omit=dev

EXPOSE 3000

RUN echo "build path dist/apps/$APP_NAME/main.js"
ENTRYPOINT ["sh", "-c", "node dist/apps/$APP_NAME/main.js"]
