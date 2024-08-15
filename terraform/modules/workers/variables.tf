variable "default_ami_id" {
  type = string
}

variable "worker_count" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "key_pair_name" {
  type = string
}

variable "instance_type" {
  default = "t3.medium"
}