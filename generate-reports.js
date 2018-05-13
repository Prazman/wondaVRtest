var fs = require('fs');
var csvWriter = require('csv-write-stream');
const output_dir = "./output/"
function readJSONFile(path) {
    let fs = require("fs");
    const content = fs.readFileSync(path);
    const result = JSON.parse(content);
    return result;
}

function arrayToCSV(path, array, exclude_fields = []){
	var writer = csvWriter()
    writer.pipe(fs.createWriteStream(path))
    for(let i = 0; i<array.length; i++){
    	for(let j = 0; j < exclude_fields.length; j++){
    		console.log(exclude_fields[j])
    		delete array[i][exclude_fields[j]]
    	}
    	writer.write(array[i])
    }
    writer.end()
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
        project.visitsCount = visits.length
        project.topVisitCountry = topVisitCountry
        project.visitDistribution = visitDistribution
        project_report.push(project)

    }
    return project_report
}

function generateUserReport(project_report){
	let user_report = [];
	for( let  i = 0; i< all_users.length; i++){
		let current_user = all_users[i];
		let user = {
			userName: current_user.userName,
			name: current_user.name,
			email: current_user.email
		}
		let projects = project_report.filter((el) => el.authorId == current_user.userId)
		
		let topVisitsCountry,
		topVisitsCount = 0,
		totalVisitDistribution = {},
		visitsCount = 0
		for(let j = 0; j < projects.length; j++){
			let project = projects[j];
			visitsCount += project.visitsCount
			for (country in project.visitDistribution){
				if(totalVisitDistribution[country]){
					totalVisitDistribution[country] += project.visitDistribution[country]
				}
				else{
					totalVisitDistribution[country] = project.visitDistribution[country]
				}
				if(totalVisitDistribution[country]> topVisitsCount){
					topVisitsCountry = country
					topVisitsCount = totalVisitDistribution[country]
				}
			}
		}

		user.projectsCount = projects.length
		user.visitsCount = visitsCount
		user.topVisitsCountry = topVisitsCountry
		user_report.push(user);
	}
	return user_report
}
let all_users = readJSONFile('./data/users.json');
let all_projects = readJSONFile('./data/projects.json');
let all_visits = readJSONFile('./data/visits.json');

let project_report = generateProjectReport();

let user_report = generateUserReport(project_report)

if (!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir);
}
arrayToCSV(output_dir + "projects.csv", project_report, ['authorId','visitDistribution']);
arrayToCSV(output_dir + "users.csv", user_report);

console.log(user_report)