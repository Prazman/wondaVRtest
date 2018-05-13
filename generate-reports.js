var fs = require('fs');
var csvWriter = require('csv-write-stream');
const output_dir = "./output/"
/*
Read a JSON file and returns parsed data
path: path of the file to read
*/
function readJSONFile(path) {
    let fs = require("fs");
    const content = fs.readFileSync(path);
    const result = JSON.parse(content);
    return result;
}
/*
Write an array to a CSV file
path: path of the file to write in
array: array to write
exclude_fields: fields present in the array you do not want to be written in the CSV
*/
function arrayToCSV(path, array, exclude_fields = []){
	var writer = csvWriter()
    writer.pipe(fs.createWriteStream(path))
    for(let i = 0; i<array.length; i++){
    	//exclude unnecessary keys
    	for(let j = 0; j < exclude_fields.length; j++){
    		delete array[i][exclude_fields[j]]
    	}
    	writer.write(array[i])
    }
    writer.end()
}
/*
Generate an array of project objects, with aggregated data from users and visits
*/
function generateProjectReport() {
    let project_report = [];
    for (let i = 0; i < all_projects.length; i++) {
    	//get useful project data
        let current_project = all_projects[i];
        let project = {
            title: current_project.title,
            url: current_project.url
        }
        //get useful user data from project's author
        let user = all_users.find((el) => (el.userId == current_project.authorId))
        project.userName = user.userName
        project.name = user.name
        project.email = user.email
        //authorId necessary for user report
        project.authorId = user.userId
        //get stats on visits associated with the project
        let visits = all_visits.filter((el) => (el.projectId == current_project.projectId))
        let topVisitCountry,
            topVisitCount = 0,
            visitDistribution = {}
        // get top visit country, and visit distribution
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
        //visit distribution object necessary for user report
        project.visitDistribution = visitDistribution
        project_report.push(project)

    }
    return project_report
}
/*
Generate and array of user objects, with aggregated data from project report
project_report: previously generated project report
*/
function generateUserReport(project_report){
	let user_report = [];
	for( let  i = 0; i< all_users.length; i++){
		let current_user = all_users[i];
		//get useful user data
		let user = {
			userName: current_user.userName,
			name: current_user.name,
			email: current_user.email
		}
		//get global stats from user's projects
		let projects = project_report.filter((el) => el.authorId == current_user.userId)
		//get top visitsCountry from user's projects visits distribution
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
//read the files
let all_users = readJSONFile('./data/users.json');
let all_projects = readJSONFile('./data/projects.json');
let all_visits = readJSONFile('./data/visits.json');
//generate reports
let project_report = generateProjectReport();

let user_report = generateUserReport(project_report)

//write the files to CSV
if (!fs.existsSync(output_dir)) {
    fs.mkdirSync(output_dir);
}
arrayToCSV(output_dir + "projects.csv", project_report, ['authorId','visitDistribution']);
arrayToCSV(output_dir + "users.csv", user_report);
