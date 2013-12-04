FROM base
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:chris-lea/node.js
RUN apt-get update
RUN apt-get install -y nodejs
ADD . /app
RUN cd /app; npm install
EXPOSE 3000
ENTRYPOINT ["node", "/app/index.js"]
