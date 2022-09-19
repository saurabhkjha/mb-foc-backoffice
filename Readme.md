# MB FOC Backoffice


## Installation

For dev environments...

```sh
npm i
npm  run start
```

For production environments...

```sh
npm install --production
npm run build
```


## Docker
```sh
cd mb-foc-backoffice
docker build -t mb-foc-backoffice .    
```

```sh
docker run -d --name mb-foc-backoffice -p 80:80 mb-foc-backoffice
```

Verify

```sh
127.0.0.1 or localhost
```

