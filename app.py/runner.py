# For testing on your phone - follow instructions that are printed out
import subprocess
import socket
import platform
import os
import sys

def get_os():
    return platform.system()

os_sys = get_os()

addr = ""
if os_sys == "Darwin":
    cmd = "ipconfig getifaddr en0"  
    ip = subprocess.check_output(cmd, shell=True, universal_newlines=True)
    print(ip.strip())
    addr = ip.strip()
elif os_sys == "Windows":
    print(socket.gethostbyname(socket.gethostname()))
    addr = socket.gethostbyname(socket.gethostname())
else:
    print("You are on an unknown operating system.")

print(f"Your Shiny Python should be served on \033[1mhttp://{addr}:9999\033[0m")
print(f"Warning: You must restart the server to see any changes you made.")
os.system(f"{sys.executable} -m shiny run --host 0.0.0.0 --port 9999 --reload --autoreload-port 9999 {os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app.py')}")


