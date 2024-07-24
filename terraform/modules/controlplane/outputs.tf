output "controlplane_public_ip" {
  value = aws_instance.controlplane.public_ip
}