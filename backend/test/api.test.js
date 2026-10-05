const BASE_URL = "http://localhost:5000";

const USER_EMAIL = "kabir.sharma06@example.com";
const ADMIN_EMAIL = "aarav.sharma01@example.com";
const OWNER_EMAIL = "rahul.owner75@example.com";
const SEEDED_PASSWORD = "Store@123";
const TEST_PASSWORD = "Testuser@123";
const USER_ID = 6;
const OWNER_ID = 75;

let adminToken = "";
let userToken = "";
let ownerToken = "";
let passed = 0;
let failed = 0;

const request = async (method, url, token = null, body = undefined) => {
  const options = { method, headers: {} };
  if (token) options.headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${url}`, options);
  const data = await response.json().catch(() => ({}));

  return { status: response.status, data };
};

const test = async (name, callback) => {
  try {
    await callback();
    passed++;
    console.log(`PASS — ${name}`);
  } catch (error) {
    failed++;
    console.log(`FAIL — ${name}`);
    console.log(`   ${error.message}`);
  }
};

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

const assertStatus = (response, expected) => assert(response.status === expected, `Expected ${expected}, got ${response.status}`);

const assertMessage = (response, expected) => assert(response.data.message === expected, `Unexpected response: ${JSON.stringify(response.data)}`);

const check = (name, method, url, token, body, status, extra) =>
  test(name, async () => {
    const response = await request(method, url, token, body);
    assertStatus(response, status);
    extra?.(response);
  });

const section = (title) => console.log(`\n========== ${title} ==========\n`);
const uid = (prefix) => `${prefix}${Date.now()}@example.com`;
const credentials = (email, password) => ({ email, password });
const signupBody = (name, email, password, address = "Bhopal") => ({ name, email, address, password });
const userBody = (name, email, password, role, address = "Bhopal") => ({ name, email, address, password, role });
const storeBody = (name, email, ownerId, address = "Bhopal") => ({ name, email, address, ownerId });

const login = async (email, password) => {
  const response = await request("POST", "/api/auth/login", null, credentials(email, password));
  if (response.status !== 200) throw new Error(`Login failed for ${email}: ${JSON.stringify(response.data)}`);
  assert(typeof response.data.token === "string", "Login response does not contain token");
  return response.data.token;
};

const getUserStores = async () => {
  const response = await request("GET", "/api/user/stores", userToken);
  assertStatus(response, 200);
  assert(Array.isArray(response.data.stores), "stores should be an array");
  return response.data.stores;
};

const main = async () => {
  console.log("\n=================================================");
  console.log("        STORE RATING SYSTEM API TEST SUITE");
  console.log("=================================================");

  section("SETUP");
  adminToken = await login(ADMIN_EMAIL, SEEDED_PASSWORD);
  userToken = await login(USER_EMAIL, SEEDED_PASSWORD);
  ownerToken = await login(OWNER_EMAIL, SEEDED_PASSWORD);
  console.log("Tokens loaded successfully.");

  section("AUTHENTICATION");
  await check("API 1 — Valid user login", "POST", "/api/auth/login", null, credentials(USER_EMAIL, SEEDED_PASSWORD), 200, (r) => assert(typeof r.data.token === "string", "Token missing"));
  await check("API 2 — Wrong password rejected", "POST", "/api/auth/login", null, credentials(USER_EMAIL, "WrongPassword@123"), 401);
  await check("API 3 — Non-existent email rejected", "POST", "/api/auth/login", null, credentials("doesnotexist@example.com", SEEDED_PASSWORD), 401);
  await check("API 4 — Missing login fields rejected", "POST", "/api/auth/login", null, {}, 400);
  await check("API 5 — Invalid login email rejected", "POST", "/api/auth/login", null, credentials("invalid-email", SEEDED_PASSWORD), 400);

  section("SIGNUP VALIDATION");
  const signup = "/api/auth/signup";
  await check("API 6 — Valid signup", "POST", signup, null, signupBody("API Test Normal User", uid("apitest"), TEST_PASSWORD, "Bhopal, Madhya Pradesh"), 201);
  await check("API 7 — Signup name below 20 characters rejected", "POST", signup, null, signupBody("Short Name", uid("short"), TEST_PASSWORD), 400);
  await check("API 8 — Signup name exactly 20 characters accepted", "POST", signup, null, signupBody("ABCDEFGHIJKLMNOPQRST", uid("name20"), TEST_PASSWORD), 201);
  await check("API 9 — Signup name above 60 characters rejected", "POST", signup, null, signupBody("A".repeat(61), uid("name61"), TEST_PASSWORD), 400);
  await check("API 10 — Signup address above 400 characters rejected", "POST", signup, null, signupBody("API Address Validation User", uid("address"), TEST_PASSWORD, "A".repeat(401)), 400);
  await check("API 11 — Duplicate signup email rejected", "POST", signup, null, signupBody("Another Duplicate User", USER_EMAIL, TEST_PASSWORD), 409);
  await check("API 12 — Password below 8 characters rejected", "POST", signup, null, signupBody("Password Minimum Test", uid("pass8"), "Test@12"), 400);
  await check("API 13 — Password exactly 8 characters accepted", "POST", signup, null, signupBody("Password Eight Test User", uid("pass8exact"), "Test@123"), 201);
  await check("API 14 — Password above 16 characters rejected", "POST", signup, null, signupBody("Password Maximum Test", uid("pass16"), "TestPassword@123456"), 400);
  await check("API 15 — Password without uppercase rejected", "POST", signup, null, signupBody("Password Uppercase Test", uid("upper"), "testuser@123"), 400);
  await check("API 16 — Password without special character rejected", "POST", signup, null, signupBody("Password Special Test", uid("special"), "Testuser123"), 400);
  await check("API 17 — Invalid signup email rejected", "POST", signup, null, signupBody("Invalid Email Validation User", "invalid-email", TEST_PASSWORD), 400);
  await check("API 18 — Missing signup fields rejected", "POST", signup, null, {}, 400);

  section("CHANGE PASSWORD");
  await check("API 19 — Change password without token rejected", "PUT", "/api/auth/change-password", null, { currentPassword: SEEDED_PASSWORD, newPassword: "Newpass@123" }, 401);

  section("ADMIN DASHBOARD");
  await check("API 20 — ADMIN can access dashboard", "GET", "/api/admin/dashboard", adminToken, undefined, 200, (r) => {
    assert(typeof r.data.totalUsers === "number", "totalUsers should be number");
    assert(typeof r.data.totalStores === "number", "totalStores should be number");
    assert(typeof r.data.totalRatings === "number", "totalRatings should be number");
  });

  section("ADMIN USER LIST");
  await check("API 21 — ADMIN can list users", "GET", "/api/admin/users?page=1&limit=10", adminToken, undefined, 200, (r) => assert(Array.isArray(r.data.users), "users should be array"));
  await check("API 22 — Admin user search by name", "GET", "/api/admin/users?search=Rahul", adminToken, undefined, 200);
  await check("API 23 — Admin user search by email", "GET", "/api/admin/users?search=owner75", adminToken, undefined, 200);
  await check("API 24 — Admin user search by address", "GET", "/api/admin/users?search=Bhopal", adminToken, undefined, 200);
  await check("API 25 — Admin user filter by role", "GET", "/api/admin/users?role=STORE_OWNER", adminToken, undefined, 200, (r) => assert(r.data.users.every((u) => u.role === "STORE_OWNER"), "Returned user has incorrect role"));
  await check("API 26 — Admin user sort by name DESC", "GET", "/api/admin/users?sortBy=name&sortOrder=DESC", adminToken, undefined, 200);
  await check("API 27 — Admin user sort by email ASC", "GET", "/api/admin/users?sortBy=email&sortOrder=ASC", adminToken, undefined, 200);
  await check("API 28 — Admin user pagination", "GET", "/api/admin/users?page=1&limit=2", adminToken, undefined, 200, (r) => assert(r.data.users.length <= 2, "Pagination limit not respected"));
  await check("API 29 — Invalid role rejected", "GET", "/api/admin/users?role=MANAGER", adminToken, undefined, 400, (r) => assertMessage(r, "Invalid role"));

  section("ADMIN STORE LIST");
  await check("API 30 — ADMIN can list stores", "GET", "/api/admin/stores", adminToken, undefined, 200, (r) => assert(Array.isArray(r.data.stores), "stores should be array"));
  await check("API 31 — Admin store search by name", "GET", "/api/admin/stores?search=Bhopal", adminToken, undefined, 200);
  await check("API 32 — Admin store search by email", "GET", "/api/admin/stores?search=superstore2", adminToken, undefined, 200);
  await check("API 33 — Admin store search by address", "GET", "/api/admin/stores?search=MP%20Nagar", adminToken, undefined, 200);
  await check("API 34 — Admin store sort name ASC", "GET", "/api/admin/stores?sortBy=name&sortOrder=ASC", adminToken, undefined, 200);
  await check("API 35 — Admin store sort name DESC", "GET", "/api/admin/stores?sortBy=name&sortOrder=DESC", adminToken, undefined, 200);
  await check("API 36 — Admin store sort email ASC", "GET", "/api/admin/stores?sortBy=email&sortOrder=ASC", adminToken, undefined, 200);
  await check("API 37 — Admin store sort email DESC", "GET", "/api/admin/stores?sortBy=email&sortOrder=DESC", adminToken, undefined, 200);
  await check("API 38 — Admin store pagination", "GET", "/api/admin/stores?page=1&limit=2", adminToken, undefined, 200, (r) => assert(r.data.stores.length <= 2, "Pagination limit not respected"));
  await check("API 39 — Invalid store sortBy safely handled", "GET", "/api/admin/stores?sortBy=invalid", adminToken, undefined, 200);
  await check("API 40 — Invalid store sortOrder safely handled", "GET", "/api/admin/stores?sortOrder=invalid", adminToken, undefined, 200);

  section("ADMIN USER DETAILS");
  await check("API 41 — ADMIN can view normal user details", "GET", `/api/admin/users/${USER_ID}`, adminToken, undefined, 200, (r) => assert(r.data.id, "User details missing"));
  await check("API 42 — ADMIN can view store owner details", "GET", `/api/admin/users/${OWNER_ID}`, adminToken, undefined, 200, (r) => assert(r.data.id, "User details missing"));
  await check("API 43 — Non-existent user rejected", "GET", "/api/admin/users/999999", adminToken, undefined, 404);

  section("USER STORE APIs");
  await test("API 44 — USER can list stores", async () => {
    const userStores = await getUserStores();
    assert(userStores.length > 0, "No stores returned");
    assert("overallRating" in userStores[0], "overallRating missing");
    assert("userRating" in userStores[0], "userRating missing");
  });
  await check("API 45 — USER can search stores by name", "GET", "/api/user/stores?search=Bhopal", userToken, undefined, 200);
  await check("API 46 — USER can search stores by address", "GET", "/api/user/stores?search=MP%20Nagar", userToken, undefined, 200);

  const hasRating = (store) => store?.userRating !== null && store?.userRating !== undefined;
  const allStores = await getUserStores();
  const testStoreId = (allStores.find((store) => !hasRating(store)) || allStores[0])?.id;
  assert(testStoreId, "Could not find a valid store ID");
  const ratingUrl = `/api/user/stores/${testStoreId}/rating`;

  section("RATING VALIDATION");
  await check("API 47 — Rating below 1 rejected", "POST", ratingUrl, userToken, { rating: 0 }, 400);
  await check("API 48 — Rating above 5 rejected", "POST", ratingUrl, userToken, { rating: 6 }, 400);
  await check("API 49 — Decimal rating rejected", "POST", ratingUrl, userToken, { rating: 4.5 }, 400);
  await check("API 50 — String rating rejected", "POST", ratingUrl, userToken, { rating: "five" }, 400);
  await check("API 51 — Missing rating rejected", "POST", ratingUrl, userToken, {}, 400);

  section("RATING CRUD");
  const currentStore = (await getUserStores()).find((store) => store.id === testStoreId);

  await test("API 52 — USER can submit or verify existing valid rating", async () => {
    if (hasRating(currentStore)) {
      const value = Number(currentStore.userRating);
      assert(value >= 1 && value <= 5, "Existing user rating is invalid");
      return;
    }
    assertStatus(await request("POST", ratingUrl, userToken, { rating: 4 }), 201);
  });
  await check("API 53 — Duplicate rating rejected", "POST", ratingUrl, userToken, { rating: 5 }, 409);
  await check("API 54 — USER can modify rating", "PUT", ratingUrl, userToken, { rating: 5 }, 200);
  await test("API 55 — Updated rating reflected in listing", async () => {
    const store = (await getUserStores()).find((item) => item.id === testStoreId);
    assert(store, "Store not found");
    assert(Number(store.userRating) === 5, `Expected userRating 5, got ${store.userRating}`);
  });
  await check("API 56 — Invalid store ID rejected", "POST", "/api/user/stores/abc/rating", userToken, { rating: 4 }, 400);
  await check("API 57 — Non-existent store rejected", "POST", "/api/user/stores/999999/rating", userToken, { rating: 4 }, 404);

  section("AUTHORIZATION");
  await check("API 58 — USER cannot access admin dashboard", "GET", "/api/admin/dashboard", userToken, undefined, 403);
  await check("API 59 — STORE_OWNER cannot access admin dashboard", "GET", "/api/admin/dashboard", ownerToken, undefined, 403);
  await check("API 60 — USER cannot access admin users", "GET", "/api/admin/users", userToken, undefined, 403);
  await check("API 61 — STORE_OWNER cannot access admin users", "GET", "/api/admin/users", ownerToken, undefined, 403);
  await check("API 62 — USER cannot access admin stores", "GET", "/api/admin/stores", userToken, undefined, 403);
  await check("API 63 — STORE_OWNER cannot access admin stores", "GET", "/api/admin/stores", ownerToken, undefined, 403);
  await check("API 64 — ADMIN cannot access USER stores", "GET", "/api/user/stores", adminToken, undefined, 403);
  await check("API 65 — STORE_OWNER cannot access USER stores", "GET", "/api/user/stores", ownerToken, undefined, 403);
  await check("API 66 — USER cannot access STORE_OWNER dashboard", "GET", "/api/store-owner/dashboard", userToken, undefined, 403);
  await check("API 67 — ADMIN cannot access STORE_OWNER dashboard", "GET", "/api/store-owner/dashboard", adminToken, undefined, 403);

  section("AUTHENTICATION SECURITY");
  await check("API 68 — USER stores without token rejected", "GET", "/api/user/stores", null, undefined, 401);
  await check("API 69 — Invalid JWT rejected", "GET", "/api/user/stores", "invalid.jwt.token", undefined, 401);
  await test("API 70 — Missing bearer token rejected", async () => {
    const response = await fetch(`${BASE_URL}/api/user/stores`, { method: "GET", headers: { Authorization: "Bearer" } });
    const data = await response.json();
    assertStatus(response, 401);
    assertMessage({ data }, "Invalid authorization format");
  });

  section("STORE OWNER");
  await check("API 71 — STORE_OWNER can access dashboard", "GET", "/api/store-owner/dashboard", ownerToken, undefined, 200, (r) => {
    assert(typeof r.data.averageRating === "number", "averageRating should be number");
    assert(Array.isArray(r.data.stores), "stores should be array");
    assert(Array.isArray(r.data.ratings), "ratings should be array");
  });
  await check("API 72 — Owner dashboard contains store rating information", "GET", "/api/store-owner/dashboard", ownerToken, undefined, 200, (r) => {
    assert(r.data.stores.length > 0, "Owner has no stores");
    assert("averageRating" in r.data.stores[0], "averageRating missing");
    assert("totalRatings" in r.data.stores[0], "totalRatings missing");
  });
  await check("API 73 — Owner dashboard rating users contain user information", "GET", "/api/store-owner/dashboard", ownerToken, undefined, 200, (r) => {
    if (r.data.ratings.length === 0) return;
    const rating = r.data.ratings[0];
    ["userId", "userName", "userEmail", "rating"].forEach((key) => assert(key in rating, `${key} missing`));
  });

  section("ADMIN CREATE USER");
  const users = "/api/admin/users";
  const fullAddress = "Bhopal, Madhya Pradesh";
  await check("API 74 — ADMIN can create USER", "POST", users, adminToken, userBody("API Created Normal User", uid("admincreate"), TEST_PASSWORD, "USER", fullAddress), 201);
  await check("API 75 — ADMIN can create ADMIN", "POST", users, adminToken, userBody("API Created System Administrator", uid("admincreate2"), "Adminpass@123", "ADMIN", fullAddress), 201);
  await check("API 76 — ADMIN can create STORE_OWNER", "POST", users, adminToken, userBody("API Created Store Owner", uid("ownercreate"), "Ownerpass@123", "STORE_OWNER", fullAddress), 201);
  await check("API 77 — Invalid admin-created user role rejected", "POST", users, adminToken, userBody("Invalid Role Created User", uid("invalidrole"), TEST_PASSWORD, "MANAGER"), 400);
  await check("API 78 — Duplicate admin-created user email rejected", "POST", users, adminToken, userBody("Duplicate Email Admin User", USER_EMAIL, TEST_PASSWORD, "USER"), 409);

  section("ADMIN CREATE STORE");
  const stores = "/api/admin/stores";
  await check("API 79 — USER cannot create store", "POST", stores, userToken, storeBody("Unauthorized Store Creation", uid("unauthorized"), OWNER_ID), 403);
  await check("API 80 — STORE_OWNER cannot create store", "POST", stores, ownerToken, storeBody("Owner Unauthorized Store", uid("ownerunauth"), OWNER_ID), 403);
  await check("API 81 — Store name below 20 rejected", "POST", stores, adminToken, storeBody("Short Store", uid("shortstore"), OWNER_ID), 400);
  await check("API 82 — Store name above 60 rejected", "POST", stores, adminToken, storeBody("A".repeat(61), uid("longstore"), OWNER_ID), 400);
  await check("API 83 — Store address above 400 rejected", "POST", stores, adminToken, storeBody("API Address Validation Store", uid("storeaddress"), OWNER_ID, "A".repeat(401)), 400);
  await check("API 84 — Invalid store email rejected", "POST", stores, adminToken, storeBody("API Invalid Email Store", "invalid-email", OWNER_ID), 400);
  await check("API 85 — Non-existent store owner rejected", "POST", stores, adminToken, storeBody("API Invalid Owner Store", uid("invalidowner"), 999999), 400);
  await check("API 86 — Normal USER cannot be store owner", "POST", stores, adminToken, storeBody("API Normal User Owner Store", uid("normalowner"), USER_ID), 400, (r) => assertMessage(r, "Invalid store owner"));
  await check("API 87 — Duplicate store email rejected", "POST", stores, adminToken, storeBody("Duplicate Store Email Test", "bhopalsuper@store.com", OWNER_ID), 409);

  section("FINAL AUTHORIZATION");
  await check("API 88 — USER cannot access admin user details", "GET", `/api/admin/users/${USER_ID}`, userToken, undefined, 403);
  await check("API 89 — STORE_OWNER cannot access admin user details", "GET", `/api/admin/users/${USER_ID}`, ownerToken, undefined, 403);
  await check("API 90 — USER cannot access store-owner dashboard", "GET", "/api/store-owner/dashboard", userToken, undefined, 403);
  await check("API 91 — ADMIN cannot access store-owner dashboard", "GET", "/api/store-owner/dashboard", adminToken, undefined, 403);

  console.log("\n=================================================");
  console.log("                 TEST SUMMARY");
  console.log("=================================================\n");
  console.log(`Total Passed : ${passed}`);
  console.log(`Total Failed : ${failed}`);
  console.log(`Total Tests  : ${passed + failed}`);
  console.log(failed === 0 ? "\nALL API TESTS PASSED\n" : `\n${failed} TEST(S) FAILED — FIX BEFORE SUBMISSION.\n`);
  console.log("=================================================\n");
};

main().catch((error) => {
  console.error("\nTEST RUNNER ERROR");
  console.error(error);
});