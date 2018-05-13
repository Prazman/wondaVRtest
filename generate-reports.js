var fs = require('fs');

function readJSONFile(path) {
    let fs = require("fs");
    const content = fs.readFileSync(path);
    const result = JSON.parse(content);
    return result;
}

function generateProjectReport() {
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
        project.authorId = user.userId
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

function generateUserReport(){
	let user_report = [];
	for( let  i = 0; i< all_users.length; i++){
		let current_user = all_users[i];
		let user = {
			userName: current_user.userName,
			name: current_user.name,
			email: current_user.email
		}
		let projects = project_report.filter((el) => el.authorId == current_user.userId)
		console.log(projects)
	}
}
let all_users = readJSONFile('./data/users.json');
let all_projects = readJSONFile('./data/projects.json');
let all_visits = readJSONFile('./data/visits.json');

let project_report = generateProjectReport();

generateUserReport()