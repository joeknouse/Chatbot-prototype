//wait until document is loaded to run script
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
	const lorumText = `<br/><p class="output-text">Tempus imperdiet nulla malesuada pellentesque. Et tortor consequat id porta nibh venenatis. Pharetra et ultrices neque ornare. In vitae turpis massa sed. Eget dolor morbi non arcu risus quis varius quam quisque. Ut etiam sit amet nisl purus in. Velit egestas dui id ornare arcu odio ut sem. Non enim praesent elementum facilisis leo vel fringilla est ullamcorper. Tortor dignissim convallis aenean et tortor at. Tellus pellentesque eu tincidunt tortor aliquam nulla. Ut porttitor leo a diam sollicitudin tempor id eu nisl. <br/><br/> Pharetra vel turpis nunc eget lorem. Purus sit amet luctus venenatis lectus magna. Rhoncus dolor purus non enim. A scelerisque purus semper eget duis at tellus at urna. Hendrerit dolor magna eget est lorem ipsum dolor sit. Maecenas pharetra convallis posuere morbi leo. In fermentum et sollicitudin ac orci phasellus. Magna fringilla urna porttitor rhoncus dolor purus non. Tristique et egestas quis ipsum. Id diam vel quam elementum pulvinar etiam non. Arcu felis bibendum ut tristique et egestas quis ipsum. Leo in vitae turpis massa sed elementum tempus egestas sed. Est sit amet facilisis magna etiam tempor orci eu.</p>`;

	//add event listener to chat buttons
	inputButton.addEventListener("click", getInputText);
	clearButton.addEventListener("click", clearInputText);

	// Function to handle the return key press
	function handleKeyPress(event) {
		if (event.key === "Enter") {
			getInputText();
		}
	}

	//used to check if the looping avatar is active
	const avatarContainer = document.querySelector("#avatar__vid__container");

	// Add the event listeners
	inputField.addEventListener("focus", function () {
		inputField.addEventListener("keyup", handleKeyPress);
	});

	inputField.addEventListener("blur", function () {
		inputField.removeEventListener("keyup", handleKeyPress);
	});

	//get input text
	function getInputText() {
		// Access the input field value here
		const inputText = document
			.querySelector("#chatbot__input-text")
			.value.toLowerCase();

		//clear output container
		clearInputText();

		// Log the input text
		console.log("Input text: ", inputText);

		// Evaluate the input text
		evaluateInputText(inputText);
	}

	//clear input text
	function clearInputText(event) {
		let avatarVideo = document.querySelector("#avatar__video");
		document.querySelector("#chatbot__input-text").value = "";
		//clear output text
		outputText.innerHTML = "";
		outputText.innerHTML = "Ask me something again!";

		//check if the clear button was clicked
		event ? resetAvatar : null;

		//avatarContainer.innerHTML = `<video autoplay muted loop width="100%" src="vid/rest_loop.mp4" class="avatar-vid" type="video/mp4"></video>`;
	}

	//reset avatar loop video
	function resetAvatar() {
		let avatarVideo = document.querySelector("#avatar__video");
		avatarVideo.setAttribute("src", "vid/rest_loop.mp4");
		avatarVideo.load();
		avatarVideo.loop = true;
	}

	// Data structure for keywords and responses
	const responsesData = [
		{
			keywords: [
				"hey, how are you?",
				"how you doing?",
				"hello",
				"hey there",
				"\\bhi\\b",
			],
			response: "Hello, how are you today?",
			passParam: "hello-clip",
			action: addAvatar,
		},
		{
			keywords: [
				"safety",
				"side effects",
				"safety information",
				"information on safety",
			],
			response:
				"Seems like you may be looking for information on safety and side effects. You can view more on safety here: [link]",
			passParam: "safety-clip",
			action: addAvatar,
		},
		{
			keywords: [
				"dosing",
				"dosage",
				"how much should I take",
				"how many pills is enough",
				"dosing information",
				"dosed",
				"dose",
				"how is brand y dosed",
				"how do you dose brand y",
			],
			response:
				"You mentioned dosing. If that's what you're looking for, you can view more on dosing here: [link]",
			passParam: "dosing-clip",
			action: addAvatar,
		},
		// ... more entries ...
	];

	// Function to evaluate input text
	function evaluateInputText(inputText) {
		const outputText = generateResponse(inputText);
		const outputDisplay = document.querySelector("#chatbot__output-message p");
		// Display outputText to the user
		gsap.to(outputDisplay, {
			duration: 3,
			text: {
				value: outputText,
				delimiter: " ",
			},
			ease: "none",
		});
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
				// If responseData.action is a function, call it. Otherwise, do nothing.
				typeof responseData.action === "function"
					? responseData.action(responseData.passParam)
					: null;

				//clear output container
				outputText.innerHTML = "";
				const fullResponse = responseData.response + lorumText;
				return fullResponse;
			}
		}

		return "Sorry, I don't have that information yet";
	}

	// Function to add avatar to the response
	function addAvatar(img) {
		let nameString = img.toString();
		let avatarVideo = document.querySelector("#avatar__video");
		const avatarContainer = document.querySelector("#avatar__vid__container");

		//change video src
		avatarVideo.setAttribute("src", "vid/" + nameString + ".mp4");
		avatarVideo.muted = false;
		avatarVideo.loop = false;

		//when vid ends, switxch back to loop
		avatarVideo.addEventListener("ended", resetAvatar, false, true);
	}

	// Additional entries for Condition X
	responsesData.push(
		// General Information
		{
			keywords: ["what is condition x", "about condition x"],
			response:
				"Condition X is a medical condition characterized by inflammation of the glotterous mengentinorial glands... [link to more information]",
			passParam: "about-clip",
			action: addAvatar,
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
			passParam: "brand-clip",
			action: addAvatar,
		},
		// Symptoms
		{
			keywords: ["symptoms of condition x", "signs of condition x"],
			response:
				"Common symptoms of Condition X include swollen pictorious molenite and dry dipthongian membranes... [link to more information]",
			passParam: "symptoms-clip",
			action: addAvatar,
		},
		// Diagnosis
		{
			keywords: ["diagnose condition x", "condition x diagnosis"],
			response:
				"Condition X is typically diagnosed with a series of urine tests over the course of six months... [link to more information]",
			passParam: "diagnosis-clip",
			action: addAvatar,
		},
		// Treatment
		{
			keywords: ["treatment for condition x", "how to treat condition x"],
			response:
				"Treatment options for Condition X include leaching and tear collection with subcutanious reintroduction. But recently a new treatment called Brand Y is giving hope to exasperated patients... [link to more information]",
			passParam: "treatment-clip",
			action: addAvatar,
		},
		//Efficacy
		{
			keywords: [
				"efficacy of brand Y",
				"how effective is brand Y",
				"brand Y efficacy",
				"efficacy",
				"how effective is brand Y in treating condition x",
				"how good is brand Y",
				"is brand y any good",
			],
			response:
				"Brand Y has been found to be 96% effective in treating Condition X. See condition x results in the Mandalorian study... [link to more information]",
			passParam: "efficacy-clip",
			action: addAvatar,
		},
		// Medications
		{
			keywords: ["medications for condition x", "drugs for condition x"],
			response:
				"Common medications for treating Condition X include baby aspirin and deep radiation. There's also a new medication called Brand Y that has proven far more efficacious... [link to more information]",
			passParam: "medications-clip",
			action: addAvatar,
		},
		// Side Effects
		{
			keywords: ["side effects of drug", "adverse effects"],
			response:
				"Some common side effects of this drug include sweltering and bandaliface orifice drainage. See the full list here... [link to more information]",
			passParam: "sideEffects-clip",
			action: addAvatar,
		},
		// Prevention
		{
			keywords: ["prevent condition x", "avoid condition x"],
			response:
				"Preventative measures for Condition X can be found here... [link to more information]",
			passParam: "prevention-clip",
			action: addAvatar,
		},
		// Research and Development
		{
			keywords: [
				"clinical trials",
				"condition x research",
				"study results",
				"study participants",
				"study data",
			],
			response:
				"Learn about ongoing clinical trials and research on Condition X ... [link to more information]",
			passParam: "trials-clip",
			action: addAvatar,
		},
		// Patient Support
		{
			keywords: ["patient support", "patient resources"],
			response:
				"Here are some resources and support options for patients with Condition X ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Healthcare Providers
		{
			keywords: [
				"information for doctors",
				"healthcare provider resources",
				"tools for hcp",
			],
			response:
				"There are many resources for healthcare providers treating Condition X on the resources page of the disease education website... [link to more information]",
			passParam: "resources-clip",
			action: addAvatar,
		},
		// Insurance and Costs
		{
			keywords: [
				"insurance coverage",
				"cost of treatment",
				"cost of drug",
				"cost of medication",
				"access",
				"cost of brand y",
				"insurance coverage for brand y",
				"can't afford brand y",
			],
			response:
				"Information on insurance coverage and costs associated with Condition X treatment ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
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
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Corporate Information
		{
			keywords: [
				"company history",
				"pharmaceutical company products",
				"corporate information",
			],
			response:
				"Learn about the history and products of our pharmaceutical company ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Lifestyle and Management
		{
			keywords: ["lifestyle changes for condition x", "managing condition x"],
			response:
				"Making lifestyle changes such as ... can help in managing Condition X. [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Alternative Therapies
		{
			keywords: ["alternative therapies for condition x", "natural remedies"],
			response:
				"Some alternative therapies for Condition X include ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Patient Stories
		{
			keywords: ["patient stories", "condition x experiences"],
			response:
				"Read stories and experiences from patients who have Condition X ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Doctor Consultation
		{
			keywords: [
				"consult a doctor",
				"talk to a physician",
				"should I use brand y",
				"is brand y right for me",
				"can it cure condition x",
				"cure me",
			],
			response:
				"It's important to consult a doctor for professional medical advice regarding Condition X ... [link to find a doctor]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Drug Interactions
		{
			keywords: ["drug interactions", "medication interactions"],
			response:
				"Learn about how different medications can interact with each other ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Family and Caregivers
		{
			keywords: ["support for families", "caregivers", "caregiver support"],
			response:
				"Resources and support for families and caregivers of patients with Condition X ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Medical Procedures
		{
			keywords: ["medical procedures for condition x", "surgery"],
			response:
				"Information on medical procedures and surgeries for Condition X ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Risk Factors
		{
			keywords: ["risk factors for condition x", "who is at risk"],
			response:
				"Learn about the risk factors associated with Condition X ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Statistics
		{
			keywords: ["condition x statistics", "prevalence of condition x"],
			response:
				"Statistics and data on the prevalence of Condition X ... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Traveling with Condition X
		{
			keywords: ["traveling with condition x", "travel advice"],
			response:
				"Tips and advice for traveling with Condition X ... [link to more information]",
			passParam: "defaultAvatar2-clip",
			action: addAvatar,
		},
		// Emergency Care
		{
			keywords: [
				"emergency care for condition x",
				"what to do in an emergency",
			],
			response:
				"Information on what to do in case of an emergency related to Condition X ... [link to more information]",
			passParam: "defaultAvatar2-clip",
			action: addAvatar,
		},
		// Latest News
		{
			keywords: [
				"latest news on condition x",
				"recent developments",
				"updates",
				"recent news",
				"press release",
			],
			response:
				"Stay updated with the latest news and developments on Condition X ... [link to more information]",
			passParam: "defaultAvatar2-clip",
			action: addAvatar,
		},
		// Community and Forums
		{
			keywords: ["condition x community", "discussion forums"],
			response:
				"Join communities and forums to discuss and share experiences about Condition X ... [link to more information]",
			passParam: "defaultAvatar2-clip",
			action: addAvatar,
		},
		// Mental Health
		{
			keywords: ["mental health and condition x", "psychological support"],
			response:
				"Information on mental health and psychological support for patients with Condition X ... [link to more information]",
			passParam: "mentalHealth-clip",
			action: addAvatar,
		},
		// Nutrition and Diet
		{
			keywords: ["nutrition for condition x", "dietary advice"],
			response:
				"Dietary advice and nutrition information for managing Condition X ... [link to more information]",
			passParam: "defaultAvatar2-clip",
			action: addAvatar,
		},
		// MOA
		{
			keywords: [
				"moa",
				"mecanism of action",
				"how does it work",
				"how does brand y work?",
				"molecular structure",
			],
			response:
				"Brand Y activates the protein delivery motorduct in the gland spatula of a patient's nordomis. This shrinks the swelling of the pictorious molenite... [link to more information]",
			passParam: "MOA-clip",
			action: addAvatar,
		},
		// MOD
		{
			keywords: [
				"mod",
				"mecanism of disease",
				"condition x affects",
				"condition x affects",
			],
			response:
				"Condition X is a bacterial bondel that inhibits protein delivery to a patient's motorduct, and you can read more about that here... [link to more information]",
			passParam: "MOD-clip",
			action: addAvatar,
		},
		// Administering Brand Y
		{
			keywords: [
				"How do I take brand y",
				"How do I take this drug",
				"How much brand y am I supposed to take",
				"administering brand y",
				"how to take brand y",
				"how to take this drug",
				"administration of brand y",
			],
			response:
				"You can find information regarding the administration of Brand Y here. However, if you are a patient considering Brand Y or currently taking Brand Y, it's important to talk to your doctor before starting or changing treatment... [link to more information]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		},
		// Find a doctor
		{
			keywords: [
				"find a doctor",
				"where can I find a doctor",
				"doctors near me",
				"doctors nearby",
				"doctor locations",
				"where can I find a doctor who treats condition x",
				"where are you located",
				"who treats condition x",
			],
			response:
				"You can find doctors that treat Condition X in your area by visiting the disease awareness website. Click here to go there now... [link to more informa  tion]",
			passParam: "defaultAvatar-clip",
			action: addAvatar,
		}
		// ... add more entries ...
	);
}
