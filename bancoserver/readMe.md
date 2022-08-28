# to run db only

docker-compose -f docker-compose.dbOnly.yml -d


# build new server

- IN server folder

docker build -t newearthart/bancoserver:1.X .
docker push newearthart/bancoserver:1.X


- update docker-compose.yml

- in Client folder

docker run --rm -v $(pwd):/out openapitools/openapi-generator-cli generate  -i http://host.docker.internal:5012/swagger/v2/swagger.yaml -o /out/src/generated_server -g typescript-axios