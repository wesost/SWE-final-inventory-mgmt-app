# Managing User Credentials

## Instructions:

There is a script in the root project directory called manage-users.sh. This script allows developers/maintainers to manage users' credentials from the command line. See usage section below for appropriate syntax. **This script must be run while Docker is up and running.**

## Script Usage:

```
Usage:
  manage-users.sh add --username USER --password PASS [--email EMAIL] [--admin]
  manage-users.sh delete --username USER
  manage-users.sh list
```