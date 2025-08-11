//Function to create form html:
function getUpdateFormHTML() {
    return `
        <div class="close-upd-div">X</div>
        <h3>Update the user:</h3>
        <form action="" method="post" id="form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password">
            <label for="phone">Phone:</label>
            <input type="tel" id="phone" name="phone">
            <button type="submit">Update User</button>
            <button type="button" class="cancel-update">CANCEL UPDATE!</button>
        </form>
    `;
}

//Function to put and animate update form:
function createUpdateDiv() {
	const newDiv = document.createElement("div");

	newDiv.classList.add("upd-div");

	newDiv.innerHTML = getUpdateFormHTML();

	//Add an entry animations:
	addFadeInAnimation(newDiv);

	return newDiv;
}

