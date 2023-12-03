## How to generate private key
```bash
  openssl genpkey -algorithm RSA -out private_key.pem -pkeyopt rsa_keygen_bits:2048
```

## How to generate public key
```bash
  openssl rsa -pubout -in private_key.pem -out public_key.pem
```

## How to convert private e public key in base64
```bash
  base64 public_key.pem > public_key-base64.txt
  base64 private_key.pem > private_key-base64.txt
```