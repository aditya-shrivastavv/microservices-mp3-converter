# Kubernetes

## Kubeseal

### Command to convert a secret to a sealed secret

```bash
kubeseal --format yaml --cert ../keys/kubeseal/tls.crt --kubeconfig ../kube/config < regular-secret.yaml > sealed-secret.yaml
```

## MySQL

volumes: The ./mysql:/docker-entrypoint-initdb.d line mounts the mysql directory from your host
 (which contains your init.sql) to the container's /docker-entrypoint-initdb.d directory. MySQL
 will execute any .sql, .sh, or .sql.gz files found in this directory in alphabetical order.
