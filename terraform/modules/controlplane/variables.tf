variable "default_ami_id" {
  type = string
}

variable "security_group_id" {
  type = string
}

variable "key_pair_name" {
  type = string
}

variable "instance_type" {
  type    = string
  default = "t3.medium"
}