variable "worker_count" {
  type    = string
  default = "4"
}

variable "public_key_path" {
  default = "../keys/accesskey.pub"
}

variable "key_pair_name" {
  default = "cluster_key"
}

variable "private_ssh_key" {
  default = "../keys/accesskey"
}