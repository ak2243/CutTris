import socket

# Get port
port = input("What port would you like to use (default 3000)? ")
try:
    port = int(port)
    if (port <= 0):
        raise ValueError()
except: # Might want to specify what kind of exception
    print("\tInvalid or blank port value, defaulting to 3000")
    port = 3000

das = input("What delayed auto shift (DAS) value would you like to use (default 150)? ")
try:
    das = int(das)
    if (das < 0):
        raise ValueError()
except: # Might want to specify what kind of exception
    print("\tInvalid or blank DAS value, defaulting to 150")
    das = 150

arr = input("What auto repeat rate (ARR) value would you like to use (default 50)? ")
try:
    arr = int(arr)
    if (arr < 0):
        raise ValueError()
except: # Might want to specify what kind of exception
    print("\tInvalid or blank ARR value, defaulting to 50")
    arr = 50
try:
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
except:
    print("Unable to get Hostname and IP")
    exit()
 
outputStr = """PORT={port}
IP={ip}
DAS={das}
ARR={arr}
"""
outputStr = outputStr.format(port=port, ip=ip, das=das, arr=arr)

print('\n') # a few new lines to act as a separator
print(outputStr)
print('\n')
print("Writing to .env file...")
f = open(".env", "w")
f.write(outputStr)
f.close()
print("complete")
