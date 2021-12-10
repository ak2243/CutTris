import os
import sys
import socket

if (len(sys.argv) > 1):
    port = sys.argv[1]
else:
    port = 3000 # default value

try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
except:
    print("Unable to get Hostname and IP")
    exit()
 
# write to .env file
f = open(".env", "w")
f.write("PORT=" + str(port) + '\n')
f.write("IP=" + str(ip) + '\n')
f.close()
