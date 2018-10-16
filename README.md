# generate data

To generate json suitable to bulk upload to ElasticSearch, use

```sh
npm run converter -- ./data/baseline.csv
npm run converter -- ./data/cincinnati.csv
npm run converter -- ./data/cincinnati-benchmarks.csv --type benchmark --index cincinnati
```

For more options see

```sh
npm run converter -- --help
```
