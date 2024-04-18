# Introduction

Part Pay was created to make managing payroll and part-time scheduling easier. Designed with small to medium-sized enterprises in mind, it boosts productivity by taking into account the schedules and automatically compute payments. This system makes managing less frequent workers easier by providing an easy-to-use way to manage leave, keep track of hours worked, and make sure payroll is accurate.

### Architecture diagram

![Architecture](architecture.png)

## PartPay Installation

### Prerequisites

- Node Package Manager it wil install along with node [download node](https://nodejs.org/en/download)
- Test if npm is istalled
  ```bash
  npm --version
  ```
- After installing node, install yarn
  ```bash
  npm install --global yarn
  ```
- Clone this project:

  ```bash
  git clone https://github.com/pavankumarchebelli/PartPay_Demo.git
  cd PartPay_Demo
  ```

### Run the project

1. Go to server files and install packages then start the server:
   ```bash
   cd serverFiles/
   npm i
   npm start
   ```
2. The data base is included in the server so no need to start it separately it starts automatically when the server starts..

3. Now open another terminal in the PartPay_Demo folder and go to ui files and install packages:
   ```bash
   yarn
   yarn dev
   ```
4. Access via clicking the link that pops up after running yarn dev.
