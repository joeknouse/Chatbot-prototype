//wait until document is loaded to run, vanilla javascript
document.addEventListener("DOMContentLoaded", startSite());

//startSite function
function startSite() {
	console.clear();
	console.log("DOM fully loaded and parsed");

	//get the buttons
	const inputButton = document.querySelector("#chatbot__input-button");
	const clearButton = document.querySelector("#chatbot__input-clear");
	const inputField = document.querySelector("#chatbot__input-text");

	//get the input text
	let inputText;
	let outputText = document.querySelector("#chatbot__output-message p");

	//add event listener to chat buttons
	inputButton.addEventListener("click", getInputText);
	clearButton.addEventListener("click", clearInputText);

	// Function to handle the return key press
	function handleKeyPress(event) {
		if (event.key === "Enter") {
			getInputText();
		}
	}

	// Add the event listeners
	inputField.addEventListener("focus", function () {
		inputField.addEventListener("keyup", handleKeyPress);
	});

	inputField.addEventListener("blur", function () {
		inputField.removeEventListener("keyup", handleKeyPress);
	});

	// The getInputText function to be called when the return key is pressed
	function getInputText() {
		// Access the input field value here
		const inputText = inputField.value;
		// Do something with the input text
		console.log("Input text:", inputText);
	}

	//get input text
	function getInputText() {
		inputText = document
			.querySelector("#chatbot__input-text")
			.value.toLowerCase();
		console.log(inputText);

		evaluateInputText(inputText);
	}

	//clear input text
	function clearInputText() {
		document.querySelector("#chatbot__input-text").value = "";
		//clear output text
		outputText.innerHTML = "";
		outputText.innerHTML = "Ask me something again!";
	}

	// Data structure for keywords and responses
	const responsesData = [
		{
			keywords: ["hello", "\\bhi\\b"],
			response: "Hello, how are you today?",
		},
		{
			keywords: ["safety", "side effects"],
			response:
				"Seems like you may be looking for information on safety and side effects. You can view more on safety here: [link]",
		},
		{
			keywords: ["dosing"],
			response:
				"You mentioned dosing. If that's what you're looking for, you can view more on dosing here: [link]",
		},
		// ... more entries ...
	];

	// Function to evaluate input text
	function evaluateInputText(inputText) {
		const outputText = generateResponse(inputText);
		// Display outputText to the user
		document.querySelector("#chatbot__output-message p").innerHTML = outputText;
	}

	// Function to generate response based on input text
	function generateResponse(inputText) {
		// Fuse.js options
		const options = {
			keys: ["keyword"],
			includeScore: true,
			threshold: 0.7, // Adjust this for sensitivity, lower means more strict
		};

		// Create an array of all keywords
		const allKeywords = responsesData.flatMap((data) =>
			data.keywords.map((keyword) => ({ keyword }))
		);

		// Create a new Fuse instance
		const fuse = new Fuse(allKeywords, options);

		// Perform the fuzzy search
		const result = fuse.search(inputText);

		// If there's a match, find the corresponding response
		if (result.length > 0 && result[0].score !== undefined) {
			const matchedKeyword = result[0].item.keyword;
			const responseData = responsesData.find((data) =>
				data.keywords.includes(matchedKeyword)
			);
			if (responseData) {
				return responseData.response;
			}
		}

		return "Sorry, I don't have that information yet";
	}

	/* function generateResponse(inputText) {
		const doc = nlp(inputText.toLowerCase());

		for (let data of responsesData) {
			for (let keyword of data.keywords) {
				// Ensure keyword is a string
				keyword = String(keyword);

				// Use a regular expression for flexible matching
				const regex = new RegExp("\\b" + keyword + "\\b", "i");

				// Check if the keyword is in the tokens (using Compromise)
				const isMatch = doc.match(regex).found;

				// If there's a match, return the response
				if (isMatch) {
					return data.response;
				}
			}
		}
		return "Sorry, I don't have that information yet";
	} */

	// Additional entries for Condition X
	responsesData.push(
		// General Information
		{
			keywords: ["what is condition x", "about condition x"],
			response:
				"Condition X is a medical condition characterized by ... [link to more information]",
		},
		// Brand Information
		{
			keywords: [
				"brand Y",
				"product information",
				"treatment with brand Y",
				"product",
				"help for condition x",
				"products that can help with condition x",
			],
			response:
				"Brand Y is an approved treatment for dealing with Condition X. It has a novel mechanism of action that deals with Condition X with proven efficacy ... [link to more information]",
		},
		// Symptoms
		{
			keywords: ["symptoms of condition x", "signs of condition x"],
			response:
				"Common symptoms of Condition X include ... [link to more information]",
		},
		// Diagnosis
		{
			keywords: ["diagnose condition x", "condition x diagnosis"],
			response:
				"Condition X is typically diagnosed through ... [link to more information]",
		},
		// Treatment
		{
			keywords: ["treatment for condition x", "how to treat condition x"],
			response:
				"Treatment options for Condition X include ... [link to more information]",
		},
		// Medications
		{
			keywords: ["medications for condition x", "drugs for condition x"],
			response:
				"Common medications for treating Condition X include ... [link to more information]",
		},
		// Side Effects
		{
			keywords: ["side effects of drug", "adverse effects"],
			response:
				"Some common side effects of this drug include ... [link to more information]",
		},
		// Prevention
		{
			keywords: ["prevent condition x", "avoid condition x"],
			response:
				"Preventative measures for Condition X include ... [link to more information]",
		},
		// Research and Development
		{
			keywords: ["clinical trials", "condition x research"],
			response:
				"Learn about ongoing clinical trials and research on Condition X ... [link to more information]",
		},
		// Patient Support
		{
			keywords: ["patient support", "patient resources"],
			response:
				"Here are some resources and support options for patients with Condition X ... [link to more information]",
		},
		// Healthcare Providers
		{
			keywords: ["information for doctors", "healthcare provider resources"],
			response:
				"Resources and information for healthcare providers treating Condition X ... [link to more information]",
		},
		// Insurance and Costs
		{
			keywords: [
				"insurance coverage",
				"cost of treatment",
				"cost of drug",
				"cost of medication",
				"access",
			],
			response:
				"Information on insurance coverage and costs associated with Condition X treatment ... [link to more information]",
		},
		// Regulatory and Compliance
		{
			keywords: [
				"regulations",
				"compliance in pharmaceuticals",
				"regulatory",
				"compliance",
			],
			response:
				"Information on regulations and compliance in the pharmaceutical industry ... [link to more information]",
		},
		// Corporate Information
		{
			keywords: ["company history", "pharmaceutical company products"],
			response:
				"Learn about the history and products of our pharmaceutical company ... [link to more information]",
		},
		// Lifestyle and Management
		{
			keywords: ["lifestyle changes for condition x", "managing condition x"],
			response:
				"Making lifestyle changes such as ... can help in managing Condition X. [link to more information]",
		},
		// Alternative Therapies
		{
			keywords: ["alternative therapies for condition x", "natural remedies"],
			response:
				"Some alternative therapies for Condition X include ... [link to more information]",
		},
		// Patient Stories
		{
			keywords: ["patient stories", "condition x experiences"],
			response:
				"Read stories and experiences from patients who have Condition X ... [link to more information]",
		},
		// Doctor Consultation
		{
			keywords: ["consult a doctor", "talk to a physician"],
			response:
				"It's important to consult a doctor for professional medical advice regarding Condition X ... [link to find a doctor]",
		},
		// Drug Interactions
		{
			keywords: ["drug interactions", "medication interactions"],
			response:
				"Learn about how different medications can interact with each other ... [link to more information]",
		},
		// Family and Caregivers
		{
			keywords: ["support for families", "caregivers"],
			response:
				"Resources and support for families and caregivers of patients with Condition X ... [link to more information]",
		},
		// Medical Procedures
		{
			keywords: ["medical procedures for condition x", "surgery"],
			response:
				"Information on medical procedures and surgeries for Condition X ... [link to more information]",
		},
		// Risk Factors
		{
			keywords: ["risk factors for condition x", "who is at risk"],
			response:
				"Learn about the risk factors associated with Condition X ... [link to more information]",
		},
		// Statistics
		{
			keywords: ["condition x statistics", "prevalence of condition x"],
			response:
				"Statistics and data on the prevalence of Condition X ... [link to more information]",
		},
		// Traveling with Condition X
		{
			keywords: ["traveling with condition x", "travel advice"],
			response:
				"Tips and advice for traveling with Condition X ... [link to more information]",
		},
		// Emergency Care
		{
			keywords: [
				"emergency care for condition x",
				"what to do in an emergency",
			],
			response:
				"Information on what to do in case of an emergency related to Condition X ... [link to more information]",
		},
		// Latest News
		{
			keywords: ["latest news on condition x", "recent developments"],
			response:
				"Stay updated with the latest news and developments on Condition X ... [link to more information]",
		},
		// Community and Forums
		{
			keywords: ["condition x community", "discussion forums"],
			response:
				"Join communities and forums to discuss and share experiences about Condition X ... [link to more information]",
		},
		// Mental Health
		{
			keywords: ["mental health and condition x", "psychological support"],
			response:
				"Information on mental health and psychological support for patients with Condition X ... [link to more information]",
		},
		// Nutrition and Diet
		{
			keywords: ["nutrition for condition x", "dietary advice"],
			response:
				"Dietary advice and nutrition information for managing Condition X ... [link to more information]",
		}
		// ... add more entries ...
	);
}
