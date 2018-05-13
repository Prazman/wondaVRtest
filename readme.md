# Wonda VR Interview Test

## Introduction

You work at a company that has an existing SAAS product that allows non-developers to easily create and publish websites. After signing up, their clients can create websites and publish them online so that they can be viewed by their audience.

In order to improve their product, the company gives you an export of their database and asks you to generate two csv files that their marketing team can import in Excel.

## Mission

### 1. Setup the project

- Run `npm install` to install dependencies.
- Run `npm run generate-data` to generate three json files in the *data* folder. We will suppose in this exercise that these json files are the exports of the company's database.
- Create a private git repository for the project in Gitlab (which provides private repositories for free).

### 2. Generate reports

Your task is to implement the generation of the two csv files defined below (There are two sample csv files in the *samples* folder).
We should be able to run the command `npm run generate-reports` to generate the two files.

- users-report.csv: contains the following data about users:
    - userName of the user
    - name of the user
    - email of the user
    - number of projects created by the user
    - total number of times all user projects were visited (viewed)
    - the country with the most visits to the user's projects

- projects-report.csv: contains the following data about projects:
    - title of the project
    - url of the project
    - userName of the author
    - name of the author
    - email of the author
    - total number of times the project was visited (viewed)
    - the country with the most vists to the project

### 3. Notes

Create a *notes.md* file with your remarks about the project (possible improvements or evolutions, problems that need to be fixed, technology stack, content and structure of the database, quality of the *generate-data.js* script, ...)

### 3. Optimize data generation

As you have probably noticed in the file *package.json*, the `npm run generate-data` command uses a parameter which allows it to use up to 2 GB of memory.

Since this code will be executed on a machine with limited memory, can you optimize it to run with max memory set to 128 MB.

## Work Submission

To submit your work, please share the private repository you created for the project with saber@wondavr.com (username: saber-ch). Note that *Guest* members can't access the code of the repository in Gitlab, so the access level should be *Reporter* at least.
