const fs = require("fs");
const csv = require("csv-parser");

// Read CSV file
function readCsv(fileName) {
  return new Promise((resolve, reject) => {
    const list = [];
    fs.createReadStream(fileName)
      .pipe(csv())
      .on("data", (data) => {
        list.push(data);
      })
      .on("end", () => {
        resolve(list);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

// Assign secret children
function assignSecretChildren(employees, previousAssignments) {
  const employeeCount = employees.length;
  const newAssignments = [];

  for (let i = 0; i < employeeCount; i++) {
    const employee = employees[i];
    let secretChild = getRandomEmployee(
      employees,
      employee,
      previousAssignments,
      newAssignments
    );

    newAssignments.push({
      Employee_Name: employee.Employee_Name,
      Employee_EmailID: employee.Employee_EmailID,
      Secret_Child_Name: secretChild.Employee_Name,
      Secret_Child_EmailID: secretChild.Employee_EmailID,
    });
  }
  return newAssignments;
}

function getRandomEmployee(
  employees,
  currentEmployee,
  previousAssignments,
  newAssignments
) {
  let randomEmployee;
  do {
    randomEmployee = employees[Math.floor(Math.random() * employees.length)];
  } while (
    //check if the random employee is not the current employee
    randomEmployee.Employee_EmailID === currentEmployee.Employee_EmailID ||
    //check if the random employee was not assigned to the current employee in the previous year
    isAssignedPreviously(
      randomEmployee,
      currentEmployee,
      previousAssignments
    ) ||
    //check if the random employee is already assigned to someone else but the currentEmployee in the current year
    isAssignedInCurrentYear(randomEmployee, currentEmployee, newAssignments)
  );
  return randomEmployee;
}

function isAssignedPreviously(
  randomEmployee,
  currentEmployee,
  previousAssignments
) {
  return previousAssignments.some(
    (assignment) =>
      assignment.Secret_Child_EmailID === randomEmployee.Employee_EmailID &&
      assignment.Employee_EmailID === currentEmployee.Employee_EmailID
  );
}

function isAssignedInCurrentYear(
  randomEmployee,
  currentEmployee,
  newAssignments
) {
  return newAssignments.some(
    (assignment) =>
      assignment.Secret_Child_EmailID === randomEmployee.Employee_EmailID &&
      assignment.Employee_EmailID !== currentEmployee.Employee_EmailID
  );
}

// Write CSV file
function writeSecretSantaAssignments(assignments, fileName) {
  return new Promise((resolve, reject) => {
    const header = [
      "Employee_Name",
      "Employee_EmailID",
      "Secret_Child_Name",
      "Secret_Child_EmailID",
    ];
    const rows = assignments.map((assignment) => Object.values(assignment));

    const data = [header, ...rows];

    const csvData = data.map((row) => row.join(",")).join("\n");

    fs.writeFile(fileName, csvData, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

// Validate CSV file data
function validateCsvData(data, expectedFields) {
  // Check if data is not empty
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(
      "Invalid CSV data. The file is empty or not in the correct format."
    );
  }

  // Get the first row Headers
  const fields = Object.keys(data[0]);

  // Check if the number of fields matches the expected number of fields
  // and if all the expected fields are present in the data
  if (
    fields.length !== expectedFields.length ||
    !expectedFields.every((field) => fields.includes(field))
  ) {
    throw new Error("Invalid CSV data. Missing or incorrect fields.");
  }

  // Iterate over each row in the data
  for (const row of data) {
    // Iterate over each expected field
    for (const field of expectedFields) {
      // Check if the field is missing or has an empty value
      if (!row[field] || row[field].trim().length === 0) {
        throw new Error(
          `Invalid CSV data. Missing or empty value for field '${field}'.`
        );
      }
    }
  }
}

// main function
async function runSecretSantaGame(
  employeeListFile,
  previousAssignmentsFile,
  resultFile
) {
  try {
    const employees = await readCsv(employeeListFile);
    validateCsvData(employees, ["Employee_Name", "Employee_EmailID"]);

    const previousAssignments = await readCsv(previousAssignmentsFile);
    validateCsvData(previousAssignments, [
      "Employee_Name",
      "Employee_EmailID",
      "Secret_Child_Name",
      "Secret_Child_EmailID",
    ]);

    const assignments = assignSecretChildren(employees, previousAssignments);

    await writeSecretSantaAssignments(assignments, resultFile);

    // console.log("Secret Santa assignments generated successfully!");
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

runSecretSantaGame(
  "Employee-List.csv",
  "Secret-Santa-Game-Result-2023.csv",
  "Secret-Santa-Game-Result-2024.csv"
);

module.exports = {
  assignSecretChildren,
};
