import { User } from "./User.js";

const FIRE = new User();
// FIRE.updateUsername('google');

// WIP: setting variables for html input
const USERNAME = document.getElementById("username");
const INDUSTRY = document.getElementById("industry");
const EDUCATION = document.getElementById("education");
const DEFAULTSELECTION = document.getElementById("test");

FIRE.getAttribute("username").then((username) => (USERNAME.placeholder = username));
FIRE.getAttribute("industry").then((industry) => (INDUSTRY.placeholder = industry));
FIRE.getAttribute("education").then((education) => (DEFAULTSELECTION.innerHTML = education));

document.getElementById("update").onclick = function () {
	const FIRE = new User();
	if (USERNAME.value !== "") FIRE.updateUsername(USERNAME.value);
	if (INDUSTRY.value !== "") FIRE.updateIndustry(INDUSTRY.value);
	if (EDUCATION.value !== "") FIRE.updateEducation(EDUCATION.value);
	// FIRE.updateUsername('google');
};
