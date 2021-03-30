import { User } from "./User.js";

/**
 * new User object with functions to update and get user info
 */
const FIRE = new User();

// containers for user-info
const USERNAME = document.getElementById("username");
const INDUSTRY = document.getElementById("industry");
const EDUCATION = document.getElementById("education");
const DEFAULTSELECTION = document.getElementById("test");

/**
 * setting the value of the containers to the current logged in user's info
 */
FIRE.getAttribute("username").then((username) => (USERNAME.placeholder = username));
FIRE.getAttribute("industry").then((industry) => (INDUSTRY.placeholder = industry));
FIRE.getAttribute("education").then((education) => (DEFAULTSELECTION.innerHTML = education));

/**
 * updates the users-info if new info is entered
 */
document.getElementById("update").onclick = function () {
	const FIRE = new User();
	if (USERNAME.value !== "") FIRE.updateUsername(USERNAME.value);
	if (INDUSTRY.value !== "") FIRE.updateIndustry(INDUSTRY.value);
	if (EDUCATION.value !== "") FIRE.updateEducation(EDUCATION.value);
	// FIRE.updateUsername('google');
};
