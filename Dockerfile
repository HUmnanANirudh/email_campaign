# frontend build stage

FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ ./

RUN npm run build

# backend build stage
FROM golang:1.25-alpine AS backend-builder

WORKDIR /app

COPY backend/go.mod ./

RUN go mod download

COPY backend/ ./

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o email_campaign .

# final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=backend-builder /app/email_campaign .

COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 8080

CMD ["./email_campaign"]
