echo "--- Creating infrastructure (terraform apply) ---"
terraform -chdir=terraform apply -auto-approve

echo "--- Cooldown 10 seconds ---"
Start-Sleep -Seconds 10

echo "--- Cluster initialization (ansible-playbook) ---"
wsl -d Ubuntu-22.04 -u root -e env ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.ini --private-key keys/accesskey playbooks/main.yaml

# echo "--- Cooldown 5 seconds ---"
# Start-Sleep -Seconds 5

# echo "--- Change IP in kubeconfig ---"
# wsl -d Ubuntu-22.04 -u root -e env ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.ini --private-key /mnt/e/projects/microservices-project-mp3-converter/keys/accesskey /mnt/e/projects/microservices-project-mp3-converter/playbooks/local.yaml