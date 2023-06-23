const { assignSecretChildren } = require("./index.js");

describe("Secret Santa Game", () => {
  const employees = [
    { Employee_Name: "Alice", Employee_EmailID: "alice@example.com" },
    { Employee_Name: "Bob", Employee_EmailID: "bob@example.com" },
    { Employee_Name: "Charlie", Employee_EmailID: "charlie@example.com" },
  ];

  const previousAssignments = [
    {
      Employee_Name: "Alice",
      Employee_EmailID: "alice@example.com",
      Secret_Child_Name: "Bob",
      Secret_Child_EmailID: "bob@example.com",
    },
    {
      Employee_Name: "Bob",
      Employee_EmailID: "bob@example.com",
      Secret_Child_Name: "Charlie",
      Secret_Child_EmailID: "charlie@example.com",
    },
    {
      Employee_Name: "Charlie",
      Employee_EmailID: "charlie@example.com",
      Secret_Child_Name: "Alice",
      Secret_Child_EmailID: "alice@example.com",
    },
  ];

  it("should assign secret children to each employee", () => {
    const newAssignments = assignSecretChildren(employees, previousAssignments);
    expect(newAssignments).toEqual([
      {
        Employee_Name: "Alice",
        Employee_EmailID: "alice@example.com",
        Secret_Child_Name: "Charlie",
        Secret_Child_EmailID: "charlie@example.com",
      },
      {
        Employee_Name: "Bob",
        Employee_EmailID: "bob@example.com",
        Secret_Child_Name: "Alice",
        Secret_Child_EmailID: "alice@example.com",
      },
      {
        Employee_Name: "Charlie",
        Employee_EmailID: "charlie@example.com",
        Secret_Child_Name: "Bob",
        Secret_Child_EmailID: "bob@example.com",
      },
    ]);
  });
});
