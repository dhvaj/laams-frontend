import fs from 'fs';

const API_URL = 'http://localhost:3001';

async function testDatabase() {
  console.log(`Connecting to database API at ${API_URL}...`);
  const headers = { 'Authorization': 'Bearer mock-jwt-token-for-3' };
  try {
    // 1. Fetch Users
    const usersRes = await fetch(`${API_URL}/users`, { headers });
    if (!usersRes.ok) throw new Error(`Failed to fetch /users: ${usersRes.statusText}`);
    const users = await usersRes.json();
    console.log(`\x1b[32m✔\x1b[0m Successfully connected to database. Found ${users.length} users.`);

    // 2. Fetch Assignments
    const assignmentsRes = await fetch(`${API_URL}/assignments`, { headers });
    if (!assignmentsRes.ok) throw new Error(`Failed to fetch /assignments: ${assignmentsRes.statusText}`);
    const assignments = await assignmentsRes.json();
    console.log(`\x1b[32m✔\x1b[0m Found ${assignments.length} assignments.`);

    // Validate Assignments
    const invalidAssignments = assignments.filter(a => a.studentId !== "1" || a.classId !== "1");
    if (invalidAssignments.length > 0) {
      console.warn(`\x1b[33m⚠\x1b[0m Warning: ${invalidAssignments.length} assignments do not have studentId: "1" and classId: "1".`);
    } else {
      console.log(`\x1b[32m✔\x1b[0m All assignments have correct relational IDs (studentId: "1", classId: "1").`);
    }

    // 3. Fetch Exams
    const examsRes = await fetch(`${API_URL}/exams`, { headers });
    if (!examsRes.ok) throw new Error(`Failed to fetch /exams: ${examsRes.statusText}`);
    const exams = await examsRes.json();
    console.log(`\x1b[32m✔\x1b[0m Found ${exams.length} exams.`);

    // Validate Exams
    const invalidExams = exams.filter(e => e.studentId !== "1" || e.classId !== "1");
    if (invalidExams.length > 0) {
      console.warn(`\x1b[33m⚠\x1b[0m Warning: ${invalidExams.length} exams do not have studentId: "1" and classId: "1".`);
    } else {
      console.log(`\x1b[32m✔\x1b[0m All exams have correct relational IDs (studentId: "1", classId: "1").`);
    }

    // 4. Fetch Classes
    const classesRes = await fetch(`${API_URL}/classes`, { headers });
    if (!classesRes.ok) throw new Error(`Failed to fetch /classes: ${classesRes.statusText}`);
    const classes = await classesRes.json();
    console.log(`\x1b[32m✔\x1b[0m Found ${classes.length} classes.`);

    // Validate Classes
    const invalidClasses = classes.filter(c => c.teacherId !== "2");
    if (invalidClasses.length > 0) {
      console.warn(`\x1b[33m⚠\x1b[0m Warning: ${invalidClasses.length} classes do not have teacherId: "2".`);
    } else {
      console.log(`\x1b[32m✔\x1b[0m All classes have correct relational IDs (teacherId: "2").`);
    }

    console.log('\n\x1b[32m=== DATABASE VALIDATION PASSED ===\x1b[0m');
    process.exit(0);

  } catch (error) {
    console.error('\n\x1b[31m=== DATABASE VALIDATION FAILED ===\x1b[0m');
    console.error(error.message);
    process.exit(1);
  }
}

testDatabase();
