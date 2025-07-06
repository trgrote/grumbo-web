#!/usr/bin/env python3
"""
Startup script for the RPG Character Tracker backend.
This script sets up the database and starts the FastAPI server.
"""

import subprocess
import sys
import os

def install_requirements():
    """Install Python requirements"""
    print("Installing Python requirements...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def start_server():
    """Start the FastAPI server"""
    print("Starting FastAPI server on http://localhost:8001")
    subprocess.call([sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"])

if __name__ == "__main__":
    try:
        # Change to backend directory
        os.chdir(os.path.dirname(os.path.abspath(__file__)))
        
        # Install requirements
        install_requirements()
        
        # Start server
        start_server()
        
    except KeyboardInterrupt:
        print("\nServer stopped by user")
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)
