import socket

port = 3000 # advanced users can manually edit this in the .env file
try:
    # get ip address of current machine
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    s.connect(("8.8.8.8", 80))
    ip = s.getsockname()[0]
except:
    print("Unable to get Hostname and IP")
    print("Please ensure you have a functioning internet connection.")
    print("You may proceed and run the project through localhost.")
    exit()
 
outputStr = """PORT={port}
IP={ip}
"""
outputStr = outputStr.format(port=port, ip=ip)

print(outputStr)
print("Writing to .env file...")
f = open(".env", "w")
f.write(outputStr)
f.close()
print("complete")
