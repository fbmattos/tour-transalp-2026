# ── Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# Which trip this deployment serves (see src/data/activeTrip.ts).
# Overridable via `fly deploy --build-arg VITE_TRIP=<id>`.
ARG VITE_TRIP=mallorca-2026
ENV VITE_TRIP=$VITE_TRIP
RUN npm run build

# ── Serve stage ──────────────────────────────────────────────
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
