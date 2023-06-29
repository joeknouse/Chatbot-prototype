//wait until document is loaded to run, vanilla javascript
document.addEventListener("DOMContentLoaded", startSite());

//startSite function
function startSite() {
	console.log("DOM fully loaded and parsed");

	//get the buttons
	const inputButton = document.querySelector("#chatbot__input-button");
	const clearButton = document.querySelector("#chatbot__input-clear");

	//get the input text
	let inputText;
	let outputText = document.querySelector("#chatbot__output-message p");

	//add event listener to chat buttons
	inputButton.addEventListener("click", getInputText);
	clearButton.addEventListener("click", clearInputText);

	//get input text if enter is pressed
	document
		.querySelector("#chatbot__input-text")
		.addEventListener("keyup", getInputText);

	//get input text
	function getInputText() {
		inputText = document
			.querySelector("#chatbot__input-text")
			.value.toLowerCase();
		console.log(inputText);

		evaluateInputText();
	}

	//clear input text
	function clearInputText() {
		document.querySelector("#chatbot__input-text").value = "";
		//clear output text
		outputText.innerHTML = "";
		outputText.innerHTML = "Ask me something again!";
	}

	//evaluate input text
	function evaluateInputText() {
		if (inputText === "") {
			outputText.innerHTML =
				"Please enter a question or phrase in the mesage field";
		} else if (inputText.includes("hello") || inputText.includes(" hi ")) {
			outputText.innerHTML = "Hello, how are you today?";
		} else if (
			inputText.includes("safety") ||
			inputText.includes("side effects") ||
			(inputText.includes("about") && inputText.includes("side effects")) ||
			(inputText.includes("about") && inputText.includes("safety"))
		) {
			outputText.innerHTML =
				"Seems like you may be looking for information on safety and side effects. You can view more on safety here: https://www.cdc.gov/coronavirus/2019-ncov/prevent-getting-sick/prevention.html";
		} else if (
			inputText.includes("dosing") ||
			(inputText.includes("about") && inputText.includes("dosing"))
		) {
			outputText.innerHTML =
				"You mentioned dosing. If that's what you're looking for, you can view more on dosing here: https://www.cdc.gov/coronavirus/2019-ncov/vaccines/faq.html";
		} else if (
			inputText.includes("efficacy") ||
			(inputText.includes("about") && inputText.includes("efficacy"))
		) {
			outputText.innerHTML =
				"Are you looking for information on efficacy? If so, you can view more on efficacy here: https://www.cdc.gov/coronavirus/2019-ncov/vaccines/effectiveness.html";
		} else if (
			inputText.includes("treatment") ||
			(inputText.includes("about") && inputText.includes("treatment"))
		) {
			outputText.innerHTML =
				"Seems like you might be looking for treatment options. You can view more on treatment here: https://www.cdc.gov/coronavirus/2019-ncov/if-you-are-sick/treatment.html";
		} else if (
			inputText.includes("about") ||
			inputText.includes("general") ||
			(inputText.includes("information") &&
				!inputText.includes("prescribe") &&
				!inputText.includes("prescribing")) ||
			(inputText.includes("info") &&
				!inputText.includes("prescribe") &&
				!inputText.includes("prescribing"))
		) {
			outputText.innerHTML =
				"Are you looking for general info? You can find more about this product here: https://www.cdc.gov/coronavirus/2019-ncov/vaccines/index.html";
		} else if (
			inputText.includes(" pi ") ||
			(inputText.includes("about") && inputText.includes(" pi ")) ||
			inputText.includes("prescribing information") ||
			(inputText.includes("about") &&
				inputText.includes("prescribing information")) ||
			inputText.includes("prescribing info") ||
			(inputText.includes("about") && inputText.includes("prescribing info")) ||
			inputText.includes("prescriber") ||
			(inputText.includes("about") && inputText.includes("prescriber info")) ||
			inputText.includes("prescribing") ||
			(inputText.includes("about") && inputText.includes("prescribing"))
		) {
			outputText.innerHTML =
				"Are you looking for perscribing information (PI)? You can read or download that information here: https://www.fda.gov/media/144414/download";
		} else if (
			inputText.includes("access") ||
			inputText.includes("insurance") ||
			(inputText.includes("patient") && inputText.includes("access")) ||
			(inputText.includes("affordable") && inputText.includes("care"))
		) {
			outputText.innerHTML =
				"Are you trying to find materials related to patient access? You can view more here: https://www.cdc.gov/coronavirus/2019-ncov/vaccines/faq.html";
		} else if (
			inputText.includes("pipeline") ||
			inputText.includes("future") ||
			(inputText.includes("future") && inputText.includes("products"))
		) {
			outputText.innerHTML =
				"Want to more about our drug pipeline?: https://www.cdc.gov/coronavirus/2019-ncov/vaccines/faq.html";
		} else if (
			inputText.includes("resources") ||
			inputText.includes("resource") ||
			inputText.includes("tools") ||
			inputText.includes("tool") ||
			(inputText.includes("download") && inputText.includes("resources"))
		) {
			outputText.innerHTML =
				"Would you like to browse a selection of patient and HCP resources? Look here: https://www.cdc.gov/coronavirus/2019-ncov/vaccines/faq.html";
		} else if (
			inputText.includes("location") ||
			(inputText.includes("where") && inputText.includes("located")) ||
			(inputText.includes("where") && inputText.includes("find")) ||
			(inputText.includes("find") && inputText.includes("specialist"))
		) {
			outputText.innerHTML =
				"If you want to find an HCP that specializes in your condition, follow this link: https://www.cdc.gov/coronavirus/2019-ncov/vaccines/faq.html";
		} else {
			outputText.innerHTML = "Sorry, I don't have that information yet";
		}
	}
}
