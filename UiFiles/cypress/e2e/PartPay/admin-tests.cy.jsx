describe("Admin Tests", () => {
  beforeEach(() => {
    cy.restoreLocalStorage();
    cy.intercept("POST", "/signup", {
      statusCode: 201,
      body: { message: "User signed up successfully." },
    }).as("signupRequest");
    cy.intercept("POST", "/login", {
      statusCode: 200,
      body: { auth: true, employee_id: null, message: "Login Successful", org_id: 1, role: "admin", token: "token" },
    }).as("loginRequest");
    cy.intercept("GET", "/profile", {
      statusCode: 200,
      body: {
        id: 1,
        name: "admin",
        email: "admin@email.com",
        address: null,
        phone: null,
        role: "admin",
      },
    }).as("getProfile");
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
    cy.intercept("POST", "/adduser/new", {
      statusCode: 201,
      body: { message: "User created successfully and added to ord successfully." },
    }).as("signupRequest");
    cy.intercept("GET", "/tax", {
      statusCode: 200,
      body: [
        {
          id: 1,
          name: "Fed Only",
          tax_types: [
            {
              tax_information_id: 1,
              tax_type_id: 1,
            },
          ],
        },
      ],
    }).as("getTax");
    cy.intercept("GET", "/taxtypes", {
      statusCode: 200,
      body: [{ id: 1, name: "FED", deduction_percentage: 10 }],
    }).as("getTaxTypes");
    cy.intercept("POST", "/taxtypes/new", {
      statusCode: 201,
      body: {
        id: 2,
        name: "Medical",
        deduction_percentage: 10,
        message: "Tax type created successfully.",
      },
    }).as("createTaxType");
    cy.intercept("POST", "/tax/new", {
      statusCode: 201,
      body: {
        id: 2,
        name: "Fed and Medical",
        tax_types: [
          {
            tax_type_id: 1,
          },
          {
            tax_type_id: 2,
          },
        ],
        message: "Tax information created successfully.",
      },
    }).as("createTax");
    cy.intercept("PUT", "/profile", {
      statusCode: 200,
      body: { message: "Profile updated successfully." },
    }).as("saveProfile");
  });
  afterEach(() => {
    cy.saveLocalStorage();
  });
  it("Signup Test", () => {
    cy.visit("http://localhost:5173/signup");

    cy.get('input[name="name"]').type("admin");
    cy.get('input[name="email"]').type("admin@email.com");
    cy.get('input[name="password"]').type("admin");
    cy.get('input[name="orgName"]').type("organization");

    cy.get('button[type="submit"]').click();

    cy.wait("@signupRequest");

    cy.url().should("include", "/login");
  });

  it("Login Test", () => {
    cy.visit("http://localhost:5173/login");

    cy.get('input[name="email"]').type("admin@email.com");
    cy.get('input[name="password"]').type("admin");
    cy.get('input[name="orgName"]').type("org");

    cy.get('button[type="submit"]').click();

    cy.wait("@loginRequest");

    cy.url().should("include", "/");

    cy.wait("@getProfile");

    cy.get('input[name="name"]').should("have.value", "admin");
    cy.get('input[name="email"]').should("have.value", "admin@email.com");
    cy.get('input[name="role"]').should("have.value", "admin");
  });

  it("Should edit and save profile details", () => {
    cy.visit("http://localhost:5173");

    cy.get('button[name="edit"]').click();

    cy.get('input[name="name"]').clear().type("Jane Doe");

    cy.get('input[name="address"]').clear().type("456 New Address St");
    cy.get('input[name="phone"]').clear().type("9876543210");

    // cy.get('input[name="account-number"]').clear().type('98765432');
    // cy.get('input[name="routing-number"]').clear().type('23456789');

    cy.get('button[name="save"]').click();

    cy.wait("@saveProfile");

    cy.get('button[name="edit"]').should("contain", "Edit");

    cy.get('input[name="name"]').should("have.value", "Jane Doe");
    cy.get('input[name="address"]').should("have.value", "456 New Address St");
    cy.get('input[name="phone"]').should("have.value", "9876543210");
    // cy.get('input[name="account-number"]').should('have.value', '98765432');
    // cy.get('input[name="routing-number"]').should('have.value', '23456789');
  });

  it("Add Part time Employee and Manager", () => {
    cy.visit("http://localhost:5173/");
    cy.get('button[name="manage-profiles"]').click();

    cy.wait("@getEmployees");

    cy.get('button[name="add-new-employee"]').click();

    cy.get('input[name="name"]').type("employee 3");
    cy.get('input[name="email"]').type("employee3@email.com");
    cy.get('input[name="password"]').type("e3");
    cy.get('input[name="pay-per-hour"]');
    cy.get('button[name="save"]').click();

    cy.get('button[name="add-new-employee"]').click();

    cy.get('div[id="select-role"]').click();
    cy.get("li").contains("Manager").click();

    cy.get('input[name="name"]').type("Manager 2");
    cy.get('input[name="email"]').type("manager2@email.com");
    cy.get('input[name="password"]').type("m2");
    cy.get('button[name="save"]').click();
  });

  it("Add TaxType and Tax", () => {
    cy.visit("http://localhost:5173/");
    cy.get('button[name="payroll"]').click();

    cy.wait("@getTax");
    cy.wait("@getTaxTypes");

    cy.get('button[name="new-tax-type"]').click();

    cy.get('input[name="name"]').type("Medical");
    cy.get('input[name="deduction_percentage"]').type("10");

    cy.get('button[type="submit"]').click();

    cy.get('button[name="new-tax"]').click();

    cy.get('input[name="name"]').type("Medical");
    cy.get('input[name="tax_types"]').type("1, 2");

    cy.get('button[type="submit"]').click();
  });
});
