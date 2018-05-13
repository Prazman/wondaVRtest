const fs = require('fs');
const faker = require('faker');
faker.seed(1000);


const dataDir = './data/';

const usersCount = 500;
const meanProjectsPerUser = 10;
const meanVisitsPerProject = 100;

const registerMinDate = new Date('2016-01-01');
const registerMaxDate = new Date('2017-12-31');
const maxVisitDate = new Date('2018-05-31');

const userFilePath = dataDir + "users.json";
const projectFilePath = dataDir + "projects.json"
const visitFilePath = dataDir + "visits.json"
const user_data = [],
    project_data = []
/*
Generate random user object
*/
function generateUser() {
    const user = {
        userId: faker.random.uuid(),
        avatar: faker.image.avatar(),
        name: faker.name.findName(),
        userName: faker.internet.userName(),
        email: faker.internet.email(),
        url: faker.internet.url(),
        ip: faker.internet.ip(),
        password: faker.random.word(),
        registrationDate: faker.date.between(registerMinDate, registerMaxDate),
    };
    user_data.push({
        id: user.userId,
        registrationDate: user.registrationDate
    })
    return user;
}
/*
Generate random project object for random user
*/
function generateProject() {
    const user = faker.random.arrayElement(user_data);
    const project = {
        projectId: faker.random.uuid(),
        authorId: user.id,
        title: faker.random.words(),
        description: faker.lorem.sentences(3, 1),
        url: faker.internet.url(),
        creationDate: faker.date.between(user.registrationDate, registerMaxDate),
    };
    project_data.push({
        id: project.projectId,
        creationDate: project.creationDate
    })
    return project
}
/*
Generate random visit object for random project
*/
function generateVisit() {
    const project = faker.random.arrayElement(project_data);
    const visit = {
        id: faker.random.uuid(),
        projectId: project.id,
        ip: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        country: faker.address.country(),
        date: faker.date.between(project.creationDate, maxVisitDate),
    };
    return visit
}
/*
Generate objects and write them on the fly to a JSON file, to save memory
path: path to the destination file
objectCount: number of objects to generate
generationFunction: function that generates one object
*/
function jsonFileGenerator(path, objectCount, generationFunction) {
    fs.writeFileSync(path, "[");
    for (let i = 0; i < objectCount; i++) {
        let object = generationFunction()
        fs.appendFileSync(path, JSON.stringify(object))
        if (i < objectCount - 1) {
            fs.appendFileSync(path, ",")
        }
    }
    fs.appendFileSync(path, "]")
}
/*use of jsonFileGenerator to avoid memory issues:
-when creating huge arrays of objects
-when running JSON.stringify on a huge array of objects
 */
jsonFileGenerator(userFilePath, usersCount, generateUser);
const projectsCount = Math.round(usersCount * meanProjectsPerUser);
jsonFileGenerator(projectFilePath, projectsCount, generateProject);
const visitsCount = Math.round(projectsCount * meanVisitsPerProject);
jsonFileGenerator(visitFilePath, visitsCount, generateVisit);
