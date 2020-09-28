const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const fs = require("fs");

const render = require("./lib/htmlRenderer");

// ===== INIT FUNCTION ===== 
async function init() {
    console.log("Please prepare your team members information.");

    // Set Variable to hold HTML
    let teamHTML = "";

    // Variable to hold number of team members
    let teamSize;

    // First Question to ask to set up loop
    await inquirer.prompt({
            type: "number",
            message: "How many people will be on your team? (Please enter a number.)",
            name: "teamSize"
        })
        .then((data) => {

            // Number of team members placed in teamSize for scope purposes.
            // 1 is added start from 1 rather than 0 for user understanding.
            teamSize = data.teamSize + 1;
        });

    // If Team Size is 0, will end program
    if (teamSize === 0) {
        console.log("If you are going to build a team, please find employees to join.");
        return;
    }

    // Loop begins to ask questions depending on the size of the team
    for (i = 1; i < teamSize; i++) {

        // Global variables set
        let name;
        let id;
        let title;
        let email;

        // Prompts user to answer the basic questions of the employee
        await inquirer.prompt([{
                    type: "input",
                    message: `What is this employee's name?`,
                    name: "name"
                },
                {
                    type: "input",
                    message: `Enter the following number:(${i}). (This will assign the employee an ID number.)`,
                    name: "id"
                },
                {
                    type: "input",
                    message: `Please enter this employee's email address.`,
                    name: "email"
                },
                {
                    type: "list",
                    message: `What does this employee do for the company? (Please select a title.)`,
                    name: "title",
                    choices: ["Engineer", "Intern", "Manager"]
                }
            ])
            .then((data) => {

                // Takes data from user and places value in global variables
                name = data.name;
                id = data.id;
                title = data.title;
                email = data.email;
            });

        // Switch Case depending on the title of the employee
        switch (title) {
            case "Manager":

                // ask user of Manager's Office Number
                await inquirer.prompt([{
                        type: "input",
                        message: "What is your Manager's Office room Number?",
                        name: "roomNum"
                    }])
                    .then((data) => {

                        // Create a new object with all avaiable user input data
                        const manager = new Manager(name, id, email, data.roomNum);

                        // Reads and places HTML from manager.html in teamMemever Variable
                        teamMember = fs.readFileSync("templates/manager.html");

                        // Uses eval() to pass template literals from html files.
                        // Adds the string to the team HTML.
                        teamHTML = teamHTML + "\n" + eval('`' + teamMember + '`');
                    });
                break;

                //Steps Similar to Manager but for intern
            case "Intern":
                await inquirer.prompt([{
                        type: "input",
                        message: "Which college does your Intern attend?",
                        name: "college"
                    }])
                    .then((data) => {
                        const intern = new Intern(name, id, email, data.college);
                        teamMember = fs.readFileSync("templates/intern.html");
                        teamHTML = teamHTML + "\n" + eval('`' + teamMember + '`');
                    });
                break;

                //Steps Similar to Manager but for engineer
            case "Engineer":
                await inquirer.prompt([{
                        type: "input",
                        message: "What is your Engineer's GitHub username?",
                        name: "github"
                    }])
                    .then((data) => {
                        const engineer = new Engineer(name, id, email, data.github);
                        teamMember = fs.readFileSync("templates/engineer.html");
                        teamHTML = teamHTML + "\n" + eval('`' + teamMember + '`');
                    });
                break;

        } // End of Switch Case

    } // End of For loop

    // Reads main.html and places html in a variable
    const mainHTML = fs.readFileSync("templates/main.html");

    // Use eval to implement template literals in main.html and places teamHTML inside main template
    teamHTML = eval('`' + mainHTML + '`');

    // write file to new team.html file
    fs.writeFile("../output/team.html", teamHTML, function(err) {

        if (err) {
            return console.log(err);
        }

        console.log("Success!");

    });

    // console.log(teamHTML);
}
init();