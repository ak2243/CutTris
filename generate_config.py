import os
import sys
import socket

if (len(sys.argv) > 1):
    port = sys.argv[1]
else:
    port = 3000 # default value

try:
    host_name = socket.gethostname()
    ip = socket.gethostbyname(host_name)
except:
    print("Unable to get Hostname and IP")
    exit()
 
# write to .env file
f = open(".env", "w")
f.write("PORT=" + str(port) + '\n')
f.write("IP=" + str(ip) + '\n')
f.close()
