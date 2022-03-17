# npm-s

Run `npm install` in Docker and secure your local machine from
certain types of 
[malware](https://snyk.io/blog/peacenotwar-malicious-npm-node-ipc-package-vulnerability/)

## Installation

This will create `npm-s` alias for the current profile:

```bash
npx npm-s init-npm-s
```

## Usage

`npm-s` works as a safe alias for certain `npm` commands. Currently, the following `npm`
commands are supported:

- audit
- ci
- install
- install-ci-test
- install-test
- update
- uninstall

To use them simply run `npm-s` in the way you would use `npm`, for example:

```bash
npm-s install typescript
```

### How it works

`npm-s` uses Docker to run `npm` commands in a safe environment. It uses `node:*-slim`
images from [here](https://hub.docker.com/_/node).

`npm-s` uses major version of the Node process it is running in to determine the target
Docker image version. For example, for node v16.6.1 it will use `node:16-slim` image.

`npm-s` mounts your `node_modules` directory to the container and synchronizes
`package.json`, `package-lock.json` and `.npmrc` with container filesystem.
