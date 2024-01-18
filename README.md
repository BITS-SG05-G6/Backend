# Backend

# Group 6: Finaicial Application : WiseWallet

**_Disclaimer: As we are using a free tier service, you will need to wait around a minute when you first open the link. After that, the link works smoothly. For more information, refer to Technologies section below._**
<br />

<hr>
- Project start date: xx/11/2023
<br />
- Project end date: 17/01/2024

## Contribution

| Student Name       | Student ID | Contribution Score |
| :----------------- | :--------- | :----------------: |
| Nguyen Tran Ha Anh | S-3938490  |         0          |
| Truong Hong Van    | S-3957034  |         0          |
| Pham Le Quynh Anh  | S-3927427  |         0          |
| Bui Tuan Anh       | S-3878071  |         0          |
| Vo Thanh Thong     | S-3891925  |         0          |

## Project Structure

```
Backend/
├── controller
├── middlewares
├── models
├── routes
├── utils
├── .env
├── Dockerfile
├── index.js
├── package-lock.json
├── package.json
├── README.md
```

1. `controller/`
   Each controller is responsible for the GET and POST method of the pages, which is then imported in `routes`.
2. `middleware/`
   The handlers to check user authentication are located in this directory

3. `models`
   The directory contains the schema model for the `Bills`, `Category`, `normalTransaction`, `SavingGoal`, `Transaction`, `User`, and `Wallet`, etc. for the Backend to work with website database.

4. `routes`
   This stores the routes of the layouts. It works with the `controllers` and `middleware` to define the page route and control user access to each pages.

5. `utils`
   This directory's purpose is to create tokens, connect with and validate MongoDB ID

6. `.env`
   This file contains ENVIRONMENT VARIABLES such as ACCESS KEY, which is meant to be hidden and ignored by `.gitignore`

7. `package.json` & `package-lock.json`
   Manage dependencies and package versions.

8. `README.md`
   A text file containing useful reference information about this project.

## About:

This is an assignment project for COSC2634 Building IT Systen offered at RMIT University Vietnam during Semester 2023C.

- Campus: Saigon South (SGS), Vietnam

- Lecturer: Mr. Nguyen Hoang Thien Phuc

### Technologies used:

**MERN Stack**

- Frontend: ReactJS, TailwindCSS
- Backend: NodeJS, ExpressJS
- Database: MongoDB
- Hosting:

### Supporting tools used

- UI Prototype: Figma
- Management: Jira Software
- Other resources:TailWindCSS docs, RMIT Canvas, NPM Package, ChatGPT, Packages' Docs
- Packages: Refer to package.json and package-lock.json

## Build

To clone and run this project, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](https://npmjs.com)) installed on your computer.

- Prequisite: VSCode or Other IDE / Editor

- From your CLI, Terminal or SHELL:

```bash
# Clone this repository
$ git clone https://github.com/BITS-SG05-G6/Backend.git

# Go into the repository
$ cd Backend

# Install dependencies
$ npm install

# Start with npm
$ npm start

# OR Start with node
$ node index.js
```

## Test accounts

1. User:

```
username: User1
password: Test@1234
```

## License

This software is licensed under the MIT License ©
