# tp5-cloud

Essential commands

Server

docker rm -f minio; docker run -dit -p 9000:9000 \
  -e MINIO_ACCESS_KEY=minio -e MINIO_SECRET_KEY=minio123 \
  --hostname minio \
  --name minio \
  --network func_functions \
  -v "/home/vognum/Documents/Facultad/Cloud Computing/TP Final/data":/data \
  minio/minio server /data

Cliente
docker run --rm -it --network func_functions --entrypoint=/bin/sh minio/mc
mc config host add minio http://minio:9000 minio minio123

Faas
http://127.0.0.1:8080/ui/

Node template
faas-cli template store pull node10-express

new function
faas-cli new --lang node10-express new-file --prefix=castellanr

faas-cli up -f new-file.yml
mc event add minio/tp5 arn:minio:sqs::1:webhook --event put
mc event add minio/tp5 arn:minio:sqs::2:webhook --event put --suffix .png
mc event add minio/tp5 arn:minio:sqs::2:webhook --event put --suffix .jpg

faas logs new-file

Mongo
docker rm -f mongodb; docker run -di --name mongodb --hostname mongodb --network func_functions -p 27017:27017 -v /data/db:/data/db --cap-add NET_ADMIN mongo
