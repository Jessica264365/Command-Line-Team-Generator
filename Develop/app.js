const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");
const Choices = require("inquirer/lib/objects/choices");

//array for employees entered
let employees = [];

// questions for the user
function questions() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "role",
        message: "What is your role?",
        choices: ["Manager", "Intern", "Engineer"],
      },
      {
        type: "input",
        name: "name",
        message: "What is your name?",
      },
      {
        type: "input",
        name: "email",
        message: "What is your email?",
      },
      {
        type: "input",
        name: "id",
        message: "What is your employee I.D.?",
      },
      // depending on which role was selected additional questions are asked
      {
        type: "input",
        name: "officeNumber",
        message: "What is your office number?",
        when: (answers) => answers.role === "Manager",
      },
      {
        type: "input",
        name: "github",
        message: "What is your GitHub username?",
        when: (answers) => answers.role === "Engineer",
      },
      {
        type: "input",
        name: "school",
        message: "What school do you attend?",
        when: (answers) => answers.role === "Intern",
      },
      // the user is asked if they would like to add another employee
      {
        type: "list",
        name: "addorstop",
        message: "Who you like to add an employee?",
        choices: ["Yes", "No I am finished"],
      },
    ])
    // depending on the selected roled is given to the corresponding class
    .then(function (answers) {
      if (answers.role === "Manager") {
        const manager = new Manager(
          answers.name,
          answers.id,
          answers.email,
          answers.officeNumber
        );

        employees.push(manager);
      }
      if (answers.role === "Intern") {
        const intern = new Intern(
          answers.name,
          answers.id,
          answers.email,
          answers.school
        );

        employees.push(intern);
      }
      if (answers.role === "Engineer") {
        const engineer = new Engineer(
          answers.name,
          answers.id,
          answers.email,
          answers.github
        );

        employees.push(engineer);
      }
      // the questions() function is called again if more employees need to be added
      if (answers.addorstop === "Yes") {
        questions();
      } else {
        // if all the employees are entered the team.html is created
        fs.writeFile(outputPath, render(employees), (err) => {
          if (err) {
            return console.log(err);
          }
          console.log("It worked!");
        });
      }
    });
}

questions();
