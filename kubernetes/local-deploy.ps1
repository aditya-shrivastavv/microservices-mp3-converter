kind create cluster --config kind/kind-cluster.yaml

kubectl apply -f kubernetes/open-secrets/

kubectl apply -f kubernetes/manifests/rabbit/
kubectl apply -f kubernetes/manifests/mongodb/
kubectl apply -f kubernetes/manifests/mysql/
kubectl apply -f kubernetes/manifests/auth/
kubectl apply -f kubernetes/manifests/converter/
kubectl apply -f kubernetes/manifests/notification/

kubectl apply -f kubernetes/manifests/gateway/gateway-cm.yaml
kubectl apply -f kubernetes/manifests/gateway/gateway-deploy.yaml
kubectl apply -f kubernetes/manifests/gateway/gateway-service.yaml

kubectl apply -f kubernetes/local-ingress/gateway-ingress.yaml
kubectl apply -f kubernetes/local-ingress/rabbitmq-ingress.yaml

kubectl apply -f kind/kind-settings.yaml