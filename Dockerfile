FROM --platform=linux/amd64 node:18-buster as base
WORKDIR /app
COPY package.json yarn.lock .npmrc ./

FROM base as builder
WORKDIR /app
RUN yarn install --pure-lockfile
COPY . .
RUN yarn run build

FROM base as production
WORKDIR /app
RUN yarn install --production --pure-lockfile

FROM base
WORKDIR /app
COPY . .
COPY --from=production /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
ENV TZ Asia/Tokyo
ENV PORT 3000
EXPOSE 3000
CMD ["yarn", "run", "start:production"]
