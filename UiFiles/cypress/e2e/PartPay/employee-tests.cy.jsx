describe("Employee Tests", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: {
        auth: true,
        token: "token",
        role: "ptemployee",
        employee_id: 1,
        org_id: 1,
        message: "Login Successful",
      },
    }).as("loginRequest");
    cy.intercept("GET", "/profile", {
      statusCode: 200,
      body: {
        id: 2,
        name: "employee 1",
        email: "employee1@email.com",
        address: null,
        phone: null,
        role: "ptemployee",
        details: {
          id: 1,
          uid: 2,
          pay_per_hour: 10,
          account_number: null,
          routing_number: null,
        },
      },
    }).as("getProfile");
    cy.intercept("PUT", "/profile", {
      statusCode: 200,
      body: { message: "Profile updated successfully." },
    }).as("saveProfile");
    cy.intercept("GET", "/profile/employees", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "employee 1",
        },
        {
          id: 2,
          name: "employee 2",
        },
      ],
    }).as("getAllEmployees");
    cy.intercept("GET", "/schedule", {
      statusCode: 200,
      body: [
        {
          id: 6,
          employee_id: 2,
          date: "2024-10-17",
          start_time: "10:00",
          end_time: "12:00",
        },
        {
          id: 7,
          employee_id: 1,
          date: "2024-10-17",
          start_time: "12:00",
          end_time: "17:00",
        },
      ],
    }).as("getSchedules");
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("Login Test", () => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').type("employee1@email.com");
    cy.get('input[name="password"]').type("employee1");
    cy.get('input[name="orgName"]').type("org");

    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    cy.url().should("include", "/");

    cy.wait("@getProfile");

    cy.get('input[name="name"]').should("have.value", "employee 1");
    cy.get('input[name="email"]').should("have.value", "employee1@email.com");
    cy.get('input[name="role"]').should("have.value", "ptemployee");
  });

  it("Should edit and save profile details", () => {
    cy.visit("http://localhost:5173");

    cy.get('button[name="edit"]').click();

    cy.get('input[name="name"]').clear().type("Spacy jhon");

    cy.get('input[name="address"]').clear().type("218 N texas blvd");
    cy.get('input[name="phone"]').clear().type("958424642");
    cy.get('input[name="account-number"]').clear().type("98765432");
    cy.get('input[name="routing-number"]').clear().type("23456789");

    cy.get('button[name="save"]').click();

    cy.wait("@saveProfile");

    cy.get('button[name="edit"]').should("contain", "Edit");

    cy.get('input[name="name"]').should("have.value", "Spacy jhon");
    cy.get('input[name="address"]').should("have.value", "218 N texas blvd");
    cy.get('input[name="phone"]').should("have.value", "958424642");
    cy.get('input[name="account-number"]').should("have.value", "98765432");
    cy.get('input[name="routing-number"]').should("have.value", "23456789");
  });
  it("Can see schedules", () => {
    cy.visit("http://localhost:5173");

    cy.get('button[name="schedules"]').click();

    cy.wait("@getAllEmployees");
    cy.wait("@getSchedules");

    cy.get("h1").should("contain", "Employee Shifts");
  });
});
