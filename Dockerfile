FROM node:alpine AS build
WORKDIR /app
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
COPY package.json yarn.lock ./
RUN apk add --no-cache git
RUN yarn install --frozen-lockfile
RUN yarn cache clean
COPY . .
RUN yarn build
RUN rm -rf node_modules
RUN yarn install --production --frozen-lockfile --ignore-scripts --prefer-offline


FROM node:alpine AS development
WORKDIR /app
COPY --from=build /app/package.json /app/yarn.lock ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

CMD ["yarn", "start"]
