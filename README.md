# local setup

Do instructions from following sections in the following order:

1. `# local db`
2. `# local elasticsearch` (start up Docker)
3. `# elasticsearch mappings`
4. `# local elasticsearch` (fill with data)
5. `# local start`
6. `# local users`

# local db

To start it with memory db, create `server/datasources.local.json` with content:

```
{
  "db": {
    "name": "db",
    "connector": "memory",
    "file": "mydata.json"
  },
  "emailDs": {
    "name": "emailDs",
    "connector": "mail",
    "transports": []
  }
}
```

# elasticsearch mappings

Before uploading data to ES you need to set up dynamic mappings like so:

```sh
npm run reset
```

or (for local elasticsearch)

```sh
npm run reset -- --url http://localhost:9200
```

# local elasticsearch

To start local ElasticSearch using docker:

```
docker-compose up
```

You can access it with http://localhost:9200.

To fill it with data:

```sh
npm run converter -- ./data/baseline.json --url http://localhost:9200
npm run converter -- ./data/cincinnati.json --url http://localhost:9200
npm run converter -- ./data/cincinnati-benchmarks.json --url http://localhost:9200
```

To stop ElasticSearch and clear data:

```sh
docker-compose down -v
```

# local start

Then copy `.env.example` to `.env` and start project normally:

```sh
npm install
npm run start
```

# local users

Start up app, then

```sh
node generate-mock-users.js
```

After that, you can log in using

email: `coach1@gmail.com`
password: `1`

# generate data

To generate json suitable to bulk upload to ElasticSearch, use

```sh
npm run converter -- ./data/baseline.csv
npm run converter -- ./data/cincinnati.csv
npm run converter -- ./data/cincinnati-benchmarks.csv
```

For more options see

```sh
npm run converter -- --help
```

# debug (with VSCode)

```sh
npm run debug
```

In VSCode, use "Attach" debug configuration.
