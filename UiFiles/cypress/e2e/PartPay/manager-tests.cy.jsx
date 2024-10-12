describe("Manager Tests", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: {
        auth: true,
        token: "token",
        role: "manager",
        employee_id: null,
        org_id: 1,
        message: "Login Successful",
      },
    }).as("loginRequest");
    cy.intercept("GET", "/profile", {
      statusCode: 200,
      body: { id: 4, name: "manager", email: "manager@email.com", address: null, phone: null, role: "manager" },
    }).as("getProfile");
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
    cy.intercept("GET", "/employees", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "admin",
          email: "admin@email.com",
          address: null,
          phone: null,
          role: "admin",
        },
        {
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
        {
          id: 3,
          name: "employee 2",
          email: "employee2@email.com",
          address: null,
          phone: null,
          role: "ptemployee",
          details: {
            id: 2,
            uid: 3,
            pay_per_hour: 10,
            account_number: null,
            routing_number: null,
          },
        },
        {
          id: 4,
          name: "Manager",
          email: "manager@email.com",
          address: null,
          phone: null,
          role: "manager",
        },
      ],
    }).as("getEmployees");
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
    cy.intercept("PUT", "/profile", {
      statusCode: 200,
      body: { message: "Profile updated successfully." },
    }).as("saveProfile");
    cy.intercept("POST", "/schedule/new", {
      statusCode: 201,
      body: { message: "Schedule created successfully." },
    }).as("saveProfile");
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });

  it("Login Test", () => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').type("manager@email.com");
    cy.get('input[name="password"]').type("manager");
    cy.get('input[name="orgName"]').type("org");

    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    cy.url().should("include", "/");

    cy.wait("@getProfile");

    cy.get('input[name="name"]').should("have.value", "manager");
    cy.get('input[name="email"]').should("have.value", "manager@email.com");
    cy.get('input[name="role"]').should("have.value", "manager");
  });

  it("Should edit and save profile details", () => {
    cy.visit("http://localhost:5173");

    cy.get('button[name="edit"]').click();

    cy.get('input[name="name"]').clear().type("Mark Juck");

    cy.get('input[name="address"]').clear().type("1408 teasley ln");
    cy.get('input[name="phone"]').clear().type("9401839412");

    cy.get('button[name="save"]').click();

    cy.wait("@saveProfile");

    cy.get('button[name="edit"]').should("contain", "Edit");

    cy.get('input[name="name"]').should("have.value", "Mark Juck");
    cy.get('input[name="address"]').should("have.value", "1408 teasley ln");
    cy.get('input[name="phone"]').should("have.value", "9401839412");
  });

  it("Edit Employee", () => {
    cy.visit("http://localhost:5173/");
    cy.get('button[name="manage-profiles"]').click();

    cy.wait("@getEmployees");

    cy.get('button[id="edit-2"]').click();

    cy.get('input[name="account_number"]').clear().type("98765432");
    cy.get('input[name="routing_number"]').clear().type("23456789");

    cy.get('button[name="save"]').click();
  });

  it("Add Schedule", () => {
    cy.visit("http://localhost:5173/");
    cy.get('button[name="schedules"]').click();

    cy.wait("@getAllEmployees");
    cy.wait("@getSchedules");

    cy.get('button[name="add-schedule"]').click();

    cy.get('div[id="employee_id"]').click();
    cy.get("li").contains("employee 1").click();

    cy.get('input[name="date"]').clear().type("2024-11-21");
    cy.get('input[id="start_time"]').clear().type("09:00");
    cy.get('input[id="end_time"]').clear().type("17:00");

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
        {
          id: 8,
          employee_id: 1,
          date: "2002-11-21",
          start_time: "09:00",
          end_time: "17:00",
        },
      ],
    }).as("getUpdatedSchedules");

    cy.get('button[name="create"]').click();

    cy.wait("@getUpdatedSchedules");

    cy.get("td").contains("2002-11-21").should("exist");
    cy.get("td").contains("09:00").should("exist");
    cy.get("td").contains("17:00").should("exist");
  });
});
