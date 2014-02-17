# Tar + Docker = Tarcker

This commandline Node.js program lets you stream a tar directory with a Dockerfile and it will build an image and create/start the container.

## Install

```sh
npm install tarcker -g
```

## Usage

```sh
tar -C nodejs -c . | tarcker --name foobar
```

This will create the image `image-foobar`, create and start (without args) the container `foobar`.

## tarcker.json

Tarcker talks to docker over http. You can put a `tarcker.json` file in the root of your directory which lets you define some custom json which gets passed to `POST: /containers/create` and `POST: /containers/<id>/start` request.

You can find which properties are available at:

- http://docs.docker.io/en/latest/api/docker_remote_api_v1.7/#start-a-container
- http://docs.docker.io/en/latest/api/docker_remote_api_v1.7/#create-a-container

```json
{
  "start": {
    "Binds":["/tmp:/tmp"],
    "LxcConf":{"lxc.utsname":"docker"}
  },
  "create": {
    "Hostname":"",
    "User":"",
    "Memory":0,
    "MemorySwap":0,
    "AttachStdin":false,
    "AttachStdout":true,
    "AttachStderr":true,
    "PortSpecs":null,
    "Privileged": false,
    "Tty":false,
    "OpenStdin":false,
    "StdinOnce":false,
    "Env":null,
    "Cmd":[
    "date"
    ],
    "Dns":null,
    "Image":"base",
    "Volumes":{},
    "VolumesFrom":"",
    "WorkingDir":""
  }
}
```
