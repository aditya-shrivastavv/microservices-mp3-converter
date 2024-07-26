# Security Group Module
module "sg-create" {
  source = "./modules/security_group"
}

# SSH Key Pair Module
module "key-pair-create" {
  source          = "./modules/ssh_keys"
  key_pair_name   = var.key_pair_name
  public_key_path = var.public_key_path
}

# Controller Module
module "controller" {
  source            = "./modules/controlplane"
  default_ami_id    = data.aws_ami.default_ami.id
  security_group_id = module.sg-create.sg_id
  key_pair_name     = var.key_pair_name
}

# Workers Module
module "workers" {
  source            = "./modules/workers"
  security_group_id = module.sg-create.sg_id
  default_ami_id    = data.aws_ami.default_ami.id
  worker_count      = var.worker_count
  key_pair_name     = var.key_pair_name
}

# Write the ansible inventory
resource "local_file" "ansible_inventory" {
  depends_on = [
    module.controller,
    module.workers
  ]
    content = templatefile(
      "../hosts.ini",
      {
        master  = module.controller.controlplane_public_ip
        workers = module.workers.workers_public_ips
      })
      filename = "../inventory.ini"
}

# Test the connection the execute the ansible playbooks (Disabled because, not easy to test)
# resource "null_resource" "execute-playbook" {
  
#   depends_on = [
#     local_file.ansible_inventory
#   ]
  
#   provisioner "remote-exec" {
#     connection {
#       type        = "ssh"
#       host        = module.controller.controlplane_public_ip
#       user        = "ubuntu"
#       private_key = file(var.private_ssh_key)
#     }

#     inline = ["echo 'connected!'"]
#   }
#   provisioner "local-exec" { 
#     command = "wsl -d Ubuntu-22.04 -e env ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i ../inventory.ini --private-key ${var.private_ssh_key} /mnt/e/projects/microservices-project-mp3-converter/playbooks/main.yaml"
#   }
# }