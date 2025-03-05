import { connectToDatabase } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/auth";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Request body:", body);

    const {
      email,
      password,
      accountType,
      companyName,
      numberOfEmployees,
      dob, // This is an ISO string
      acceptTerms,
    } = body;

    // Convert the ISO string back to a Date object
    const dobDate = new Date(dob);

    // Validate required fields
    if (
      !email ||
      !email.includes("@") ||
      !password ||
      password.trim().length < 8 ||
      !/^(?=.*[!@#$%^&*])(?=.*[A-Z]).*$/.test(password) || // Password validation
      !dobDate ||
      !acceptTerms
    ) {
      return new Response(
        JSON.stringify({
          message:
            "Invalid input - password must be at least 8 characters long, contain at least 1 special character and 1 uppercase letter, and all required fields must be filled.",
        }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }

    // Additional validation for company accounts
    if (
      accountType === "company" &&
      (!companyName || !numberOfEmployees || numberOfEmployees < 1)
    ) {
      return new Response(
        JSON.stringify({
          message:
            "Company name and number of employees are required for company accounts.",
        }),
        { status: 422, headers: { "Content-Type": "application/json" } }
      );
    }

    // Connect to the database
    const client = await connectToDatabase();
    const db = client.db();

    // Check if the user already exists
    const existingUser = await db.collection("users").findOne({ email: email });

    if (existingUser) {
      client.close();
      return new Response(JSON.stringify({ message: "User already exists!" }), {
        status: 422,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Insert the new user into the database
    await db.collection("users").insertOne({
      email: email,
      password: hashedPassword,
      accountType: accountType,
      companyName: accountType === "company" ? companyName : null,
      numberOfEmployees: accountType === "company" ? numberOfEmployees : null,
      dob: dobDate, // Store as Date object
      acceptTerms: acceptTerms,
      createdAt: new Date(),
    });

    client.close();

    // Return success response
    return new Response(
      JSON.stringify({ message: "User created successfully!" }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("❌ Server error:", error);
    return new Response(JSON.stringify({ message: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}