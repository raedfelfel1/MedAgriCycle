# MedAgriCycle – Application Installation and Startup Guide
-----------------------------------------------------------

This document explains step by step how to install, configure, and run the **MedAgriCycle** application (server + mobile application).
It is intended for beginners, with no advanced development prerequisites.

Two methods are available to run the application:
-- using your computer’s local IP address  
-- using Ngrok (or equivalent) with a public URL

-----------------------------------------------------------

## 1. Hardware and Network Requirements
---------------------------------------

Before starting, make sure you have:

-- A Windows computer  
-- An Android or iOS smartphone  
-- An Internet connection  
-- The PC and the phone connected to the same Wi-Fi network  

-----------------------------------------------------------

## 2. Installing Node.js
-----------------------

Node.js is required to run both the server and the mobile application.

-- Download Node.js from the official website:
https://nodejs.org/en/download

-- Run the downloaded (.msi) installer

-- Click Next until the installation finishes  
-- Make sure the option "Add to PATH" is checked

-- Verify the installation in a terminal:
node -v  
npm -v  

-----------------------------------------------------------

## 3. PowerShell Configuration (Windows)
----------------------------------------

-- Open PowerShell as administrator  
(right-click → Run as administrator)

-- Run the following command:
Set-ExecutionPolicy Unrestricted

-- Confirm with Enter, then Y if prompted

-----------------------------------------------------------

## 4. Project Setup and Structure
---------------------------------

-- Download and extract the MedAgriCycle project

Expected structure:

MedAgriCycle/
-- client/
-- server/

-- Open:
-- one terminal in the server folder
-- one terminal in the client folder

-----------------------------------------------------------

## 5. Installing Dependencies
-----------------------------

In both folders (client and server), run:
npm install

-- Wait until the installation is complete before continuing

-----------------------------------------------------------

## 6. Choosing the Connection Method
------------------------------------

There are two ways to connect the mobile application to the server.

-----------------------------------------------------------
### METHOD 1 – Local IP Connection (recommended)
-----------------------------------------------------------

### 6.1 Retrieve your computer’s IP address

-- In a terminal, type:
ipconfig

-- Find your IPv4 address, for example:
192.168.1.42

### 6.2 Configure the IP address in the client

-- Go to:
client/app.json

-- Set the server URL using your local IP:
{
  "extra": {
    "API_URL": "http://192.168.1.42:5000"
  }
}

-- The PC and phone must be on the same Wi-Fi network

-----------------------------------------------------------
### METHOD 2 – Connection via Ngrok (or equivalent)
-----------------------------------------------------------

This method is useful if:
-- the phone is not on the same network
-- ports are blocked
-- you are testing remotely

### 6.3 Installing Ngrok

-- Download Ngrok:
https://ngrok.com/download

-- Create a free account and retrieve your token

-- In a terminal:
ngrok config add-authtoken YOUR_TOKEN

### 6.4 Start Ngrok

-- Once the server is running:
ngrok http 5000

-- Example public URL:
https://abcd-1234.ngrok-free.app

### 6.5 Configure Ngrok in the client

-- In client/app.json:
{
  "extra": {
    "API_URL": "https://abcd-1234.ngrok-free.app"
  }
}

-----------------------------------------------------------

## 7. Running the Application
-----------------------------

### 7.1 Start the server

-- In the server folder:
npm start

-- The server listens on port 5000

### 7.2 Start the mobile application

-- In the client folder:
npx expo start

-- Press S in the terminal to switch to Expo Go

-- A QR code will appear

-----------------------------------------------------------

## 8. Installing on the Phone
----------------------------

-- Install Expo Go:

-- Android: Google Play

-- iOS: App Store


-- Open Expo Go

-- Scan the QR code

-- The MedAgriCycle application will start automatically

-----------------------------------------------------------

## 9. Application Login
----------------------

Test account:

-- Email: thib@gmail.com  
-- Password: Test123456!*

Or create a new account directly in the application.

-----------------------------------------------------------

## 10. Essential Commands
------------------------

npm install  
npm start  
npx expo start  
ngrok http 5000  

-----------------------------------------------------------

## Conclusion
------------

The MedAgriCycle application is now fully operational.

It can be used:
-- on a local network
-- via Ngrok
