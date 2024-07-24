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

# # Write the ansible inventory
# resource "local_file" "ansible_inventory" {
#   depends_on = [
#     module.controller,
#     module.workers
#   ]
#     content = templatefile(
#       "../hosts.ini",
#       {
#         master  = module.controller.controller_public_ip
#         workers = module.workers.workers_public_ips
#       })
#       filename = "../inventory.ini"
# }

# # Test the connection the execute the ansible playbooks
# resource "null_resource" "execute-playbook" {
#   provisioner "remote-exec" {
#     connection {
#       type        = "ssh"
#       host        = module.controller.controller_public_ip
#       user        = "ubuntu"
#       private_key = file(var.private_ssh_key)
#     }

#     inline = ["echo 'connected!'"]
#   }
#   depends_on = [
#     local_file.ansible_inventory
#   ]
#   provisioner "local-exec" {
#     command = "ansible-playbook -i ../inventory.ini --private-key ${var.private_ssh_key} '${path.cwd}/../ansible-install-k8s/main.yaml'"
#   }
# }