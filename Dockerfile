FROM node:12-stretch-slim as build

WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install --ignore-scripts

# Copy src folder for building
COPY ./src ./src

# Run prod build: Convert src/ TypeScript to dist/ JavaScript
RUN npm run build

FROM node:12-stretch-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV PORT=80

WORKDIR /usr/src/app

COPY package*.json ./

# Now copy the dist/* JS files, config and protos created from build stage from above
COPY --from=build /usr/src/app/out /usr/src/app/out
# we are copying translation files. Do note that here we have added additiona src folder. 
# This is intentional because we want to have same relative path inside container as in local machine
Copy ./src/i18n /usr/src/app/out/src/i18n


Copy ./src/images /usr/src/app/out/src/images

ENV DOCKERRUN=true

RUN npm ci --only=production

EXPOSE 3000
EXPOSE 80

CMD ["npm", "run", "start:prod"]