const fs = require('fs');
const faker = require('faker');
faker.seed(1000);

const dataDir = './data/';

const usersCount = 1000;
const meanProjectsPerUser = 10;
const meanVisitsPerProject = 100;

const registerMinDate = new Date('2016-01-01');
const registerMaxDate = new Date('2017-12-31');
const maxVisitDate = new Date('2018-05-31');

const users = [];
for (let i = 0; i < usersCount; i++) {
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
    users.push(user);
}

const projects = [];
const projectsCount = Math.round(usersCount * meanProjectsPerUser);
for (let i = 0; i < projectsCount; i++) {
    const user = faker.random.arrayElement(users);
    const project = {
        projectId: faker.random.uuid(),
        authorId: user.userId,
        title: faker.random.words(),
        description: faker.lorem.sentences(3, 1),
        url: faker.internet.url(),
        creationDate: faker.date.between(user.registrationDate, registerMaxDate),
    };
    projects.push(project);
}

const visits = [];
const visitsCount = Math.round(projectsCount * meanVisitsPerProject);
for (let i = 0; i < visitsCount; i++) {
    const project = faker.random.arrayElement(projects);
    const visit = {
        id: faker.random.uuid(),
        projectId: project.projectId,
        ip: faker.internet.ip(),
        userAgent: faker.internet.userAgent(),
        country: faker.address.country(),
        date: faker.date.between(project.creationDate, maxVisitDate),
    };
    visits.push(visit);
}

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

fs.writeFileSync(dataDir + 'users.json', JSON.stringify(users, null, 2));
fs.writeFileSync(dataDir + 'projects.json', JSON.stringify(projects, null, 2));
fs.writeFileSync(dataDir + 'visits.json', JSON.stringify(visits, null, 2));
