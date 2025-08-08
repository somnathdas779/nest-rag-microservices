



# nest-rag-angular-microservice
Nest Js  Micro Service -  (User Management and Document Management)

## Gateway 
## User Auth 
## RBAC 
## Document Management 
## Upload Management 

## Prerequisites for - Nest Js  Micro Service

  - node
  - nvm
  - nest cli
  - docker
  - helm
  - minikube
  - kubectl
 

## Compile and run the project

```bash
$ nvm use 20
$ npm install
$ npm build
```

```bash
# development
$ npm run start:all
```

## Create Admin
```bash
curl -X POST http://localhost:4000/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "admin",
    "email": "admin@ymail.com",
    "password": "123456"
  }'
```

## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Deployment





