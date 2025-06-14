# ec-app

## STACK
- Next 15.3.1
- React 19.1.0
- PostgreSQL 16
- Prisma 6.3.1
- Node 22.14.0

## INSTALL DEPENDENCIES
- since it's running on docker containers, this is only necessary for intellisense
- run `npm i`

## RUN PROJECT
1. put `ec-app` and `ec-assets` folders inside a 'root' folder, like `em-cliques`
2. copy the `docker compose` files from `ec-app` to the root folder `em-cliques`
3. run `docker compose -f docker-compose.dev.yml up -d postgres` to create the postgres container before the node apps
4. run `docker compose -f docker-compose.dev.yml up -d` (or just use `docker compose up` if there's just one file)
5. run `npx prisma studio` on another terminal to init prisma's db admin
6. access through docker-desktop or localhost the designated ports for each application
7. even though `ec-app` depends on `postgres` it doesn't wait for the db container before creating the image

## UPDATE PRODUCTION
1. pull the code using `git pull`
2. run `docker ps` to find running containers from ec-app and ec-assets
3. run `./docker-compose.update.sh` to handle auto delete running container and rebuild it
5. run `docker ps` again to get the id of the `ec-app` container
6. run `docker exec -it <container_id> /bin/bash` to access the container's bash terminal
7. make sure all migrations can be applied automatically
8. run `npx prisma migrate deploy` to apply new migrations

## RUN STORYBOOK
1. Couldn't make it run properly in a docker container.
2. Run locally with `npm run storybook` and node installed, I'll eventually make it work with docker.

## GENERATE, MODIFY AND SEED TABLES MANUALLY
not necessary, when using docker-compose, the database will be migrated and seeded.\
open a terminal in the ec-app container (or use docker desktop) and then:
  - run `npx prisma generate` to generate the prisma client
  - run `npx prisma migrate dev`
  - run `npx prisma db seed` to seed tables

## APPLY NEW MIGRATIONS
since the docker container runs a migrate dev on startup, if a new migration needs to be created, prisma will wait for user input (that is never going to happen).\
for this reason, you need to remove the migration commands from the docker-compose file, run the new migration manually and then put the command back.\
after that, run the 'regular' docker-compose file and move along.

## RUN CHANGELOG GENERATOR
- make commits
- run `npm release<type>` after pushing all due changes
- run `git push --follow-tags origin <branch>`

## EXPOSE TEST SERVER
- run `docker run -it -e NGROK_AUTHTOKEN=xyz ngrok/ngrok:latest http --domain=hip-certain-vervet.ngrok-free.app host.docker.internal:3000` 
- this exposes ec-app (or the app running on port 3000)
- change the domain to your free account's subdomain and your authtoken
