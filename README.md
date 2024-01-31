<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

Bienvenido al backend del administrador de faltas. Para tener funcionando el backend (los datos de la aplicación) es necesario tener instalado la aplicación [docker desktop](https://docs.docker.com/desktop/) en tu computadora. De igual forma se usa mongoDB como base de datos, en el archivo `.env.template` conseguiràs los nombres de las variables de entorno necesarias para crear usuarios, materias, justificaciones y faltas al igual que manipular la informaciòn que hayas creado.

## Instalaciones

Para instalar paquetes necesarios para el backend corre el comando:

```bash
$ npm install
```

Una vez que tengas docker instalado y ejecutandose en tu computadora, por favor corre el siguiente comando:

```bash
$ docker compose up -d
```

## Para correr la aplicación en local

Te recomiendo correr el comando:

```bash
# watch mode
$ npm run start:dev
```

## Licencia

Nest esta [licenciado por MIT](LICENSE).

## NOTAS

- Todos los comandos deben correrse en la consola una vez que estes ubicado en la carpeta del proyecto.
- Si quieres correr la parte visual del administrador de faltas has click [aquí](https://github.com/daan98/absence-manager-front) y sigue los pasos que se especifican en el archivo README.md. Las faltas se pueden crear, visualizar y actualizar al correr este proyecto (absence-manager-front).
- Se recomienda el uso de **postman** para crear usuarios, materias y justificaciones. En caso de no tenerlo instalado en tu computadora haz click [aquí](https://www.postman.com/downloads/)