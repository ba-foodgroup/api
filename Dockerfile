FROM node:13.8.0-stretch

# Setup work directory
WORKDIR /app
COPY package.json /app/

# Install dependecies
RUN npm install

# Copy over project files
COPY src /app/src
COPY ./*.j* /app/

CMD [ "node", "run start" ]