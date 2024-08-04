# Kubernetes

## Kubeseal

### Command to convert a secret to a sealed secret

```bash
kubeseal --format yaml --cert ../keys/kubeseal/tls.crt --kubeconfig ../kube/config < regular-secret.yaml > sealed-secret.yaml
```
