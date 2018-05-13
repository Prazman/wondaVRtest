var fs = require('fs');

function readJSONFile(path) {
    let fs = require("fs");
    const content = fs.readFileSync(path);
    const result = JSON.parse(content);
    return result;
}

function generateProjectReport(projects) {
    let project_report = [];
    for (let i = 0; i < all_projects.length; i++) {
        let current_project = all_projects[i];
        let project = {
            title: current_project.title,
            url: current_project.url
        }
        let user = all_users.find((el) => (el.userId == current_project.authorId))
        project.userName = user.userName
        project.name = user.name
        project.email = user.email
        let visits = all_visits.filter((el) => (el.projectId == current_project.projectId))
        let topVisitCountry,
            topVisitCount = 0,
            visitDistribution = {}
        for (let j = 0; j < visits.length; j++) {
            let visit = visits[j];
            if (visitDistribution[visit.country]) {
                visitDistribution[visit.country]++;
            } else {
                visitDistribution[visit.country] = 1;
            }
            if (visitDistribution[visit.country] > topVisitCount) {
                topVisitCountry = visit.country
                topVisitCount = visitDistribution[visit.country]
            }
        }
        project.visitCount = visits.length
        project.topVisitCountry = topVisitCountry
        project.visitDistribution = visitDistribution
        project_report.push(project)

    }
    return project_report
}
let all_users = readJSONFile('./data/users.json');
let all_projects = readJSONFile('./data/projects.json');
let all_visits = readJSONFile('./data/visits.json');

generateProjectReport();