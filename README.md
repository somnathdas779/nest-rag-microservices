



# nest-rag-angular-microservice
Nest Js  Micro Service -  (User Management and Document Management)

- Gateway 
- User Auth 
- RBAC 
- Document Management 
- Upload Management 

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

# Deployment

## Docker

```bash
#check the images
chmod +x deploy/scripts/build-all.sh
./deploy/scripts/build-all.sh

#check the gateway images , apply for other service same
docker images | grep gateway

#debug the image proto is in lib folder
docker run --rm -it gateway:local sh
ls dist/apps/gateway

```

## Generate Helm Chart

```bash
chmod +x deploy/scripts/generate-helm.sh
./deploy/scripts/generate-helm.sh

#output 
🚀 Generating Helm chart for gateway...
Creating ./deploy/helm/gateway
✅ Helm chart for gateway ready at ./deploy/helm/gateway
🚀 Generating Helm chart for user-auth...
Creating ./deploy/helm/user-auth
✅ Helm chart for user-auth ready at ./deploy/helm/user-auth
🚀 Generating Helm chart for upload...
Creating ./deploy/helm/upload
✅ Helm chart for upload ready at ./deploy/helm/upload
🚀 Generating Helm chart for rbac...
Creating ./deploy/helm/rbac
✅ Helm chart for rbac ready at ./deploy/helm/rbac

```






