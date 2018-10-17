# elasticsearch

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
